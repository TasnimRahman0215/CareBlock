// backend/seed.js
require('dotenv').config();
const connectDB = require('./src/connect');
const Clinic   = require('./src/models/Clinic');
const Patient  = require('./src/models/patient');

async function seed() {
  await connectDB(process.env.MONGO_URI);

  // Create a demo clinic
  const clinic = await Clinic.create({
    name: 'Demo Hospital',
    apiKey: 'demo-key-123',
    publicKey: '',
    privateKey: ''
  });

  // Create a sample patient
  const p = await Patient.create({
    clinicId: clinic._id,
    patientId: 'P-0001',
    name: 'Alice Smith'
  });

  console.log('Seed complete:');
  console.log('  clinicId:', clinic._id.toString());
  console.log('  API key :', clinic.apiKey);
  console.log('  patientId:', p.patientId);
  process.exit();
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
