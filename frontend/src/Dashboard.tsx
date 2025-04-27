// frontend/src/Dashboard.tsx
import React, { JSX, useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserProvider, Contract } from 'ethers';
import abi from './abi.json';

// These env vars are guaranteed via non-null assertion
const API_URL = process.env.REACT_APP_API_URL!;
const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS!;

// Data shapes
interface Patient {
  patientId: string;
  name: string;
}

interface RecordData {
  bp: string;
  notes: string;
  createdAt: string;
}

export default function Dashboard(): JSX.Element {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selected, setSelected] = useState<Patient | null>(null);
  const [history, setHistory] = useState<RecordData[]>([]);
  const [contract, setContract] = useState<Contract | null>(null);

  // 1) Initialize blockchain connection
  useEffect(() => {
    const init = async () => {
      if (!window.ethereum) {
        console.error('MetaMask not installed');
        return;
      }
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const c = new Contract(CONTRACT_ADDRESS, abi.abi, signer);
      setContract(c);
    };
    init();
  }, []);

  // 2) Fetch patients
  useEffect(() => {
    axios
      .get<Patient[]>(`${API_URL}/api/patients`)
      .then(res => setPatients(res.data))
      .catch(console.error);
  }, []);

  // 3) Fetch record history
  const fetchHistory = async (patientId: string) => {
    if (!contract) {
      console.error('Contract not initialized');
      return;
    }
    try {
      const countBn = await contract.getRecordCount(patientId);
      const count = countBn.toNumber();
      const records: RecordData[] = [];
      for (let i = 0; i < count; i++) {
        const [pointer, timestampBn] = await contract.getRecord(patientId, i);
        const res = await axios.get<RecordData>(`${API_URL}/api/records/${pointer}`);
        records.push({
          bp: res.data.bp,
          notes: res.data.notes,
          createdAt: new Date(timestampBn.toNumber() * 1000).toISOString()
        });
      }
      setHistory(records);
      const patient = patients.find(p => p.patientId === patientId) || null;
      setSelected(patient);
    } catch (err) {
      console.error('Failed to fetch history', err);
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <aside style={{ width: 200, borderRight: '1px solid #ccc', padding: 16 }}>
        <h3>Patients</h3>
        {patients.map(p => (
          <div
            key={p.patientId}
            style={{ cursor: 'pointer', margin: '8px 0' }}
            onClick={() => fetchHistory(p.patientId)}
          >
            {p.name}
          </div>
        ))}
      </aside>
      <main style={{ flex: 1, padding: 16 }}>
        {!selected && <p>Select a patient to view records.</p>}
        {selected && (
          <>
            <h2>Records for {selected.name}</h2>
            <ul>
              {history.map((r, idx) => (
                <li key={idx}>
                  <strong>BP:</strong> {r.bp}<br/>
                  <strong>Notes:</strong> {r.notes}<br/>
                  <em>{new Date(r.createdAt).toLocaleString()}</em>
                </li>
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  );
}
