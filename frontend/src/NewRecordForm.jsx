import React, { useState } from "react";
import axios from "axios";

export default function NewRecordForm({
  patientId,
  contract,
  headers,
  apiUrl,
  onSaved,
}) {
  const [bp, setBp]       = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  async function save(e) {
    e.preventDefault();
    setLoading(true);

    try {
      /* ①  store encrypted record off-chain */
      const res = await axios.post(
        `${apiUrl}/api/records`,
        { patientId, data: { bp, notes } },
        { headers }
      );

      /* ②  store pointer on-chain */
      const tx = await contract.storeRecord(patientId, res.data.recordId);
      await tx.wait();

      /* ③  reset & refresh */
      setBp("");
      setNotes("");
      onSaved();
    } catch (err) {
      console.error(err);
      alert("Failed to add record");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={save} className="record-form">
      <input
        placeholder="Blood Pressure"
        value={bp}
        onChange={(e) => setBp(e.target.value)}
        required
      />
      <input
        placeholder="Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? "Saving…" : "Add Record"}
      </button>
    </form>
  );
}
