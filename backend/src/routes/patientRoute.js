// backend/src/routes/patientRoute.js
const express = require('express');
const { addPatient, listPatients } = require('../controllers/patientController');
const { addRecord, getRecord, auditRecord } = require('../controllers/recordController');

const router = express.Router();

// Patients
router.post('/patients', addPatient);
router.get('/patients', listPatients);

// Records
router.post('/records', addRecord);
router.get('/records/:recordId', getRecord);
router.get('/audit/:recordId', auditRecord);

module.exports = router;
