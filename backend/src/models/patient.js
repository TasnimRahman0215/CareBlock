// backend/src/models/patient.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const PatientSchema = new Schema({
    clinicId:        { type: Schema.Types.ObjectId, ref: 'Clinic', required: true },
    patientId:       { type: String,                    required: true }, // your UUID
    name:            { type: String,                    required: true },
    externalIdHash:  { type: String,    index: true },  // SHA-256 of SSN/ID
  }, { timestamps: true });
  
  module.exports = mongoose.model('Patient', PatientSchema);
