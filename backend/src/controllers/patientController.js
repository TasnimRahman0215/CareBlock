const Patient = require('../models/patient');

// POST /api/patients
async function addPatient(req, res) {
  try {
    const { patientId, name } = req.body;
    const clinicId = req.header('x-clinic-id');
    const p = await Patient.create({ patientId, name, clinicId });
    return res.status(201).json(p);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to add patient.' });
  }
}

// GET /api/patients
async function listPatients(req, res) {
  try {
    const clinicId = req.header('x-clinic-id');
    const list = await Patient.find({ clinicId });
    return res.json(list);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to list patients.' });
  }
}

module.exports = { addPatient, listPatients };
