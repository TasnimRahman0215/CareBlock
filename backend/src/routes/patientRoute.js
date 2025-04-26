const express = require('express');
const { addPatient } = require('../controllers/patientController');

const router = express.Router();

// POST route to add a new patient
router.post('/patients', addPatient);

module.exports = router;