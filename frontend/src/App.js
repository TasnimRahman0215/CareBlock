import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard     from "./Dashboard";
import PatientLookup from "./PatientLookup";
import { contract, account } from "./ethLocal";
import "./App.css";

const API_URL   = process.env.REACT_APP_API_URL;
const CLINIC_ID = "680d4d39f835c16d56cebb82";          // ← your seeded clinicId

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Dashboard
              account={account}
              contract={contract}
              apiUrl={API_URL}
              clinicId={CLINIC_ID}
            />
          }
        />
        <Route
          path="/lookup"
          element={
            <PatientLookup
              apiUrl={API_URL}
              clinicId={CLINIC_ID}
              onSelect={(pat) => {
                localStorage.setItem("preselect", pat.patientId);
                window.location.href = "/";
              }}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
