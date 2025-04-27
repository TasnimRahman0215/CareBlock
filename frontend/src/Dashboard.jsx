import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NewRecordForm from "./NewRecordForm";

export default function Dashboard({ account, contract, apiUrl, clinicId }) {
  const [patients, setPatients] = useState([]);
  const [selected, setSelected] = useState(null);
  const [history,  setHistory]  = useState([]);
  const navigate                = useNavigate();
  const headers                 = { "x-clinic-id": clinicId };

  /* ─── fetch patient list once ─── */
  useEffect(() => {
    axios.get(`${apiUrl}/api/patients`, { headers })
         .then((r) => setPatients(r.data))
         .catch(console.error);
  }, []);

  /* ─── restore pre-selected patient (from lookup) ─── */
  useEffect(() => {
    const id = localStorage.getItem("preselect");
    if (!id || patients.length === 0) return;
    const p = patients.find((x) => x.patientId === id);
    if (p) {
      setSelected(p);
      fetchHistory(p.patientId);
    }
    localStorage.removeItem("preselect");
  }, [patients]);

  async function fetchHistory(pid) {
    try {
      const count = await contract.getRecordCount(pid);
      const rows  = [];
      for (let i = 0; i < count; i++) {
        const [ptr, ts] = await contract.getRecord(pid, i);
        const rec = await axios.get(`${apiUrl}/api/records/${ptr}`, { headers });
        rows.push({ ...rec.data, timestamp: new Date(ts * 1000) });
      }
      setHistory(rows);
    } catch (err) {
      console.error(err);
      setHistory([]);
    }
  }

  /* ────────── UI ────────── */
  return (
    <div className="app-shell">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <h3>Patients</h3>
        {patients.map((p) => (
          <div
            key={p.patientId}
            className={
              "patient-item" + (selected?.patientId === p.patientId ? " active" : "")
            }
            onClick={() => {
              setSelected(p);
              fetchHistory(p.patientId);
            }}
          >
            {p.name}
          </div>
        ))}
        {/* BUTTONS */}
        <button
          style={{ marginTop: "1rem" }}
          className="record-form button"
          onClick={() => navigate("/lookup")}
        >
          🔍 Lookup Patient
        </button>
        <button
          style={{ marginTop: "0.5rem" }}
          className="record-form button"
          onClick={() => document.getElementById("newRec")?.scrollIntoView({behavior:"smooth"})}
        >
          ➕ Add New Record
        </button>
      </aside>

      {/* MAIN */}
      <main className="main">
        {selected ? (
          <>
            <h2>{selected.name}</h2>

            {/* new-record form target */}
            <div id="newRec">
              <NewRecordForm
                patientId={selected.patientId}
                contract={contract}
                headers={headers}
                apiUrl={apiUrl}
                onSaved={() => fetchHistory(selected.patientId)}
              />
            </div>

            <ul className="record-list">
              {history.map((h, idx) => (
                <li key={idx} className="record-item">
                  <strong>{JSON.stringify(h)}</strong><br/>
                  <em>{h.timestamp.toLocaleString()}</em>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p>Select a patient or use “Lookup Patient”.</p>
        )}
      </main>
    </div>
  );
}
