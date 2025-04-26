// backend/src/models/Clinic.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const ClinicSchema = new Schema({
  name:       { type: String, required: true },
  apiKey:     { type: String, required: true },
  publicKey:  { type: String },  // optional for future per-clinic keys
  privateKey: { type: String }   // optional
}, { timestamps: true });

module.exports = mongoose.model('Clinic', ClinicSchema);
