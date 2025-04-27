// backend/src/controllers/patientController.js
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const Patient = require('../models/patient');

// POST /api/patients
// Body: { name: string, externalId: string }
async function addPatient(req, res) {
  try {
    const { name, externalId } = req.body;
    if (!name || !externalId) {
      return res.status(400).json({ error: 'name and externalId are required' });
    }

    const clinicId = req.header('x-clinic-id');
    if (!clinicId) {
      return res.status(401).json({ error: 'Missing clinic identifier' });
    }

    // 1) Generate a UUID for this patient
    const patientId = uuidv4();

    // 2) Hash their external ID for lookup
    const externalIdHash = crypto
      .createHash('sha256')
      .update(externalId.trim())
      .digest('hex');

    // 3) Create & save
    const p = await Patient.create({
      clinicId,
      patientId,
      name,
      externalIdHash
    });

    return res.status(201).json({
      patientId: p.patientId,
      name: p.name
    });
  } catch (err) {
    console.error('addPatient error:', err);
    return res.status(500).json({ error: 'Failed to add patient.' });
  }
}

// GET /api/patients
// Header: x-clinic-id
async function listPatients(req, res) {
  try {
    const clinicId = req.header('x-clinic-id');
    if (!clinicId) {
      return res.status(401).json({ error: 'Missing clinic identifier' });
    }
    const list = await Patient.find({ clinicId }).select('patientId name createdAt');
    return res.json(list);
  } catch (err) {
    console.error('listPatients error:', err);
    return res.status(500).json({ error: 'Failed to list patients.' });
  }
}

// GET /api/patients/lookup?externalId=XYZ
async function lookupByExternalId(req, res) {
  try {
    const { externalId } = req.query;
    if (!externalId) {
      return res.status(400).json({ error: 'externalId query param required' });
    }
    const clinicId = req.header('x-clinic-id');
    if (!clinicId) {
      return res.status(401).json({ error: 'Missing clinic identifier' });
    }

    const hash = crypto
      .createHash('sha256')
      .update(externalId.trim())
      .digest('hex');

    // Find within your clinic (or globally, if you prefer remove clinicId)
    const patient = await Patient.findOne({ clinicId, externalIdHash: hash });
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    return res.json({
      patientId: patient.patientId,
      name:      patient.name
    });
  } catch (err) {
    console.error('lookupByExternalId error:', err);
    return res.status(500).json({ error: 'Lookup failed.' });
  }
}

module.exports = {
  addPatient,
  listPatients,
  lookupByExternalId
};
