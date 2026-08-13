import React from "react";
import { Navigate, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./lib/auth";
import RootRecord from "./pages/RootRecord";
import RootRecordPricing from "./pages/RootRecordPricing";
import RootRecordAbout from "./pages/RootRecordAbout";

/**
 * Apex site for https://rootrecord.info — Emergent Root Record pages on the real host.
 * Existing static paths (account/, charts/, ava wiki Worker) stay outside this SPA.
 */
export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<RootRecord />} />
        <Route path="/pricing" element={<RootRecordPricing />} />
        <Route path="/about" element={<RootRecordAbout />} />
        {/* Old Emergent / app.rootmc.net paths */}
        <Route path="/rootrecord" element={<Navigate to="/" replace />} />
        <Route path="/rootrecord/pricing" element={<Navigate to="/pricing" replace />} />
        <Route path="/rootrecord/about" element={<Navigate to="/about" replace />} />
        <Route path="/rootmc/*" element={<GoRootMc />} />
        <Route path="*" element={<RootRecord />} />
      </Routes>
    </AuthProvider>
  );
}

function GoRootMc() {
  if (typeof window !== "undefined") window.location.replace("https://rootmc.net/");
  return null;
}
