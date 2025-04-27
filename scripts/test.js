// test.js
const axios = require('axios');

(async () => {
  const API = 'http://localhost:4000/api';
  const headers = { 'x-clinic-id': '680d4d39f835c16d56cebb82' };

  // List patients
  let { data: patients } = await axios.get(`${API}/patients`, { headers });
  console.log('Patients:', patients);

  // Lookup by external ID
  let { data: lookup } = await axios.get(
    `${API}/patients/lookup?externalId=DL1234567`,
    { headers }
  );
  console.log('Lookup:', lookup);

  // Add a patient
  let { data: newPat } = await axios.post(
    `${API}/patients`,
    { name: 'Carol', externalId: 'SSN999-88-7777' },
    { headers }
  );
  console.log('New patient:', newPat);

  // Add a record
  let { data: rec } = await axios.post(
    `${API}/records`,
    { patientId: newPat.patientId, data: { bp: '130/85', notes: 'Checkup' } },
    { headers }
  );
  console.log('New recordId:', rec.recordId);

  // Fetch & audit it
  let { data: fetched } = await axios.get(
    `${API}/records/${rec.recordId}`
  );
  console.log('Decrypted record:', fetched);

  let { data: audit } = await axios.get(
    `${API}/audit/${rec.recordId}`
  );
  console.log('Audit hash:', audit.hash);
})();
