const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
    encryptedData: { type: String, required: true },
    iv: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Patient', PatientSchema);