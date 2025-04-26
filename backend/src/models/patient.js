// backend/src/models/patient.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const PatientSchema = new Schema({
  clinicId:  { type: Schema.Types.ObjectId, ref: 'Clinic', required: true },
  patientId: { type: String,                   required: true },
  name:      { type: String,                   required: true }
}, { timestamps: true });

module.exports = mongoose.model('Patient', PatientSchema);
