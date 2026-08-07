import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./lib/auth";
import Portal from "./pages/Portal";
import RootRecord from "./pages/RootRecord";
import Ava from "./pages/Ava";
import RootMCApp from "./RootMCApp";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Portal />} />
        <Route path="/rootrecord" element={<RootRecord />} />
        <Route path="/ava" element={<Ava />} />
        <Route path="/rootmc/*" element={<RootMCApp />} />
        <Route path="*" element={<Portal />} />
      </Routes>
    </AuthProvider>
  );
}
