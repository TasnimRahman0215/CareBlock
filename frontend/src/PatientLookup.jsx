import React, { useState } from "react";
import axios from "axios";

/* props: apiUrl, clinicId, onSelect(patient) */
export default function PatientLookup({ apiUrl, clinicId, onSelect }) {
  const [query, setQuery]   = useState("");
  const [result, setResult] = useState(null);
  const [err, setErr]       = useState("");

  const headers = { "x-clinic-id": clinicId };

  async function search(e) {
    e.preventDefault();
    setErr(""); setResult(null);

    try {
      /* decide whether it looks like a UUID (32/36 chars) */
      const isUuid = query.trim().length >= 32;

      const url = isUuid
        ? `${apiUrl}/api/patients?patientId=${query.trim()}`
        : `${apiUrl}/api/patients/lookup?externalId=${encodeURIComponent(query)}`;

      const { data } = await axios.get(url, { headers });
      setResult(data);
    } catch (e) {
      console.error(e);
      setErr("Not found");
    }
  }

  return (
    <div style={{ padding: "2rem", maxWidth: 460, margin: "0 auto" }}>
      <h2>Patient Lookup</h2>

      <form onSubmit={search} className="record-form">
        <input
          placeholder="External ID or UUID"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          required
        />
        <button type="submit">Search</button>
      </form>

      {err && <p style={{ color: "crimson" }}>{err}</p>}

      {result && (
        <div className="record-item">
          <strong>{result.name}</strong><br/>
          UUID: <code>{result.patientId}</code><br/>
          {onSelect && (
            <button
              style={{ marginTop: 10 }}
              onClick={() => onSelect(result)}
            >
              Open in Dashboard
            </button>
          )}
        </div>
      )}
    </div>
  );
}
