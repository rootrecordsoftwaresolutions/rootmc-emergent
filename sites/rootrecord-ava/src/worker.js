/**
 * rootrecord.info/ava*  OR  ava.rootrecord.info/*
 * Wiki static + status proxy → ava.rootmc.net
 */
const STATUS_ORIGIN = "https://ava-origin.rootmc.net";

function isSubHost(host) {
  return (
    host === "ava.rootrecord.info" ||
    host.endsWith(".workers.dev")
  );
}

function wikiPathname(url) {
  const host = url.hostname;
  let pathname = url.pathname;
  if (isSubHost(host)) {
    if (pathname === "/" || pathname === "") return "/ava/";
    if (!pathname.startsWith("/ava/")) {
      return "/ava" + (pathname.startsWith("/") ? pathname : `/${pathname}`);
    }
  }
  return pathname;
}

function statusUpstreamPath(pathname) {
  // Origin "/" 302s to this public URL — never proxy the page to "/".
  if (pathname === "/ava/status" || pathname === "/ava/status/") return "/status";
  const rest = pathname.replace(/^\/ava\/status/, "") || "/";
  if (rest.startsWith("/api/") || rest === "/health" || rest.startsWith("/phpmyadmin")) {
    return rest;
  }
  if (rest === "/solar" || rest === "/power" || rest === "/home") return rest;
  // Page routes under the status board (e.g. /connections)
  return "/status" + (rest.startsWith("/") ? rest : `/${rest}`);
}


function isContextPath(pathname) {
  return (
    pathname === "/ava/context" ||
    pathname === "/ava/context/" ||
    pathname === "/ava/context.md" ||
    pathname.startsWith("/ava/context?")
  );
}

function isLogsPath(pathname) {
  return pathname === "/ava/logs" || pathname === "/ava/logs/" || pathname.startsWith("/ava/logs?");
}

async function proxyLogs(request, pathname) {
  const url = new URL(request.url);
  const target = new URL("/logs" + url.search, STATUS_ORIGIN);
  const headers = new Headers(request.headers);
  headers.set("Host", target.host);
  const prefix = isSubHost(url.hostname) ? "/status" : "/ava/status";
  headers.set("X-Forwarded-Prefix", prefix);
  headers.set("X-Forwarded-Host", url.host);
  headers.set("X-Forwarded-Proto", "https");
  const upstream = await fetch(target, { method: request.method, headers, redirect: "manual" });
  const outHeaders = new Headers(upstream.headers);
  outHeaders.set("X-Ava-Wiki-Proxy", "logs");
  outHeaders.delete("x-frame-options");
  const ct = outHeaders.get("content-type") || "";
  if (ct.includes("text/html")) {
    let html = await upstream.text();
    const base = `${prefix}/`;
    if (!html.includes(`href="${base}"`)) {
      html = html.replace(/<head([^>]*)>/i, `<head$1><base href="${base}">`);
    }
    return new Response(html, { status: upstream.status, headers: outHeaders });
  }
  return new Response(upstream.body, { status: upstream.status, headers: outHeaders });
}

function contextUpstreamPath(pathname, search) {
  if (pathname.endsWith(".md") || (search && /[?&]format=md\b/i.test(search))) {
    return "/context?format=md";
  }
  if (search && /[?&]format=json\b/i.test(search)) {
    return "/api/context";
  }
  return "/context" + (search || "");
}

async function proxyContext(request, pathname) {
  const url = new URL(request.url);
  const upstreamPath = contextUpstreamPath(pathname, url.search);
  const target = new URL(upstreamPath, STATUS_ORIGIN);
  // contextUpstreamPath may already include query
  if (!upstreamPath.includes("?") && url.search) {
    target.search = url.search;
  }
  const headers = new Headers(request.headers);
  headers.set("Host", target.host);
  const prefix = isSubHost(url.hostname) ? "/status" : "/ava/status";
  headers.set("X-Forwarded-Prefix", prefix);
  headers.set("X-Forwarded-Host", url.host);
  headers.set("X-Forwarded-Proto", "https");
  const upstream = await fetch(target, { method: request.method, headers, redirect: "manual" });
  const outHeaders = new Headers(upstream.headers);
  outHeaders.set("X-Ava-Wiki-Proxy", "context");
  return new Response(upstream.body, { status: upstream.status, headers: outHeaders });
}

async function proxyStatus(request, pathname) {
  const url = new URL(request.url);
  const target = new URL(statusUpstreamPath(pathname) + url.search, STATUS_ORIGIN);
  const headers = new Headers(request.headers);
  headers.set("Host", target.host);
  // Subdomain uses /status as public base; apex path uses /ava/status
  const prefix = isSubHost(url.hostname) ? "/status" : "/ava/status";
  headers.set("X-Forwarded-Prefix", prefix);
  headers.set("X-Forwarded-Host", url.host);
  headers.set("X-Forwarded-Proto", "https");

  const init = { method: request.method, headers, redirect: "manual" };
  if (request.method !== "GET" && request.method !== "HEAD") init.body = request.body;

  const upstream = await fetch(target, init);
  const outHeaders = new Headers(upstream.headers);
  outHeaders.set("X-Ava-Wiki-Proxy", "status");
  outHeaders.delete("x-frame-options");

  const ct = outHeaders.get("content-type") || "";
  if (ct.includes("text/html")) {
    let html = await upstream.text();
    const base = `${prefix}/`;
    if (!html.includes(`href="${base}"`)) {
      html = html.replace(/<head([^>]*)>/i, `<head$1><base href="${base}">`);
    }
    return new Response(html, { status: upstream.status, headers: outHeaders });
  }
  return new Response(upstream.body, { status: upstream.status, headers: outHeaders });
}

async function serveWiki(request, env, pathname) {
  let assetPath = pathname.replace(/^\/ava/, "") || "/";
  if (assetPath === "/" || assetPath === "") assetPath = "/index.html";
  else if (assetPath.endsWith("/")) assetPath += "index.html";

  // Fetch asset by constructing a request ASSETS understands (no redirect chase)
  const assetUrl = new URL(assetPath, "https://assets.local");
  const res = await env.ASSETS.fetch(new Request(assetUrl, { method: "GET" }));
  if (res.status === 404 && !assetPath.endsWith(".html")) {
    const htmlUrl = new URL(assetPath.replace(/\/?$/, "") + ".html", "https://assets.local");
    return env.ASSETS.fetch(new Request(htmlUrl, { method: "GET" }));
  }
  return res;
}

function isReleaseBoardPath(pathname) {
  return (
    pathname === "/ava/status/plugins" ||
    pathname === "/ava/status/plugins/" ||
    pathname.startsWith("/ava/status/plugins?") ||
    pathname === "/ava/status/apps" ||
    pathname === "/ava/status/apps/" ||
    pathname.startsWith("/ava/status/apps?") ||
    pathname.startsWith("/ava/status/api/plugins") ||
    pathname.startsWith("/ava/status/api/apps")
  );
}

function privateReleaseBoardResponse() {
  const body = `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>Private — Ava Client</title>
<style>body{font-family:system-ui,sans-serif;background:#0b0f14;color:#e8eef7;margin:2rem;max-width:40rem}
a{color:#7dd3fc}</style></head><body>
<h1>Private operator surface</h1>
<p>Plugin / app bump · build · release is only available in the <strong>Ava Client</strong> on the OptiPlex.</p>
<p>Downloads: <a href="https://ava.rootmc.net/publicfiles/">ava.rootmc.net/publicfiles</a></p>
</body></html>`;
  return new Response(body, {
    status: 403,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
      "x-ava-wiki-proxy": "private-release-board",
    },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = wikiPathname(url);

    if (isReleaseBoardPath(pathname)) {
      return privateReleaseBoardResponse();
    }

    if (isContextPath(pathname) || pathname === "/ava/context.md") {
      try {
        return await proxyContext(request, pathname);
      } catch (err) {
        return new Response(
          `Context proxy error: ${err?.message || err}\n`,
          { status: 502, headers: { "content-type": "text/plain; charset=utf-8" } },
        );
      }
    }

    if (isLogsPath(pathname)) {
      try {
        return await proxyLogs(request, pathname);
      } catch (err) {
        return new Response(
          `Logs proxy error: ${err?.message || err}\n`,
          { status: 502, headers: { "content-type": "text/plain; charset=utf-8" } },
        );
      }
    }

    if (pathname === "/ava/status" || pathname.startsWith("/ava/status/")) {
      try {
        return await proxyStatus(request, pathname);
      } catch (err) {
        return new Response(
          `Status proxy error: ${err?.message || err}\nFallback: ${STATUS_ORIGIN}/status\n`,
          { status: 502, headers: { "content-type": "text/plain; charset=utf-8" } },
        );
      }
    }

    if (pathname === "/ava" || pathname.startsWith("/ava/")) {
      const res = await serveWiki(request, env, pathname);
      const headers = new Headers(res.headers);
      headers.set("X-Ava-Wiki", "1");
      headers.set("X-Ava-Wiki-Path", pathname);
      return new Response(res.body, { status: res.status, headers });
    }

    return new Response("Not found", { status: 404 });
  },
};
