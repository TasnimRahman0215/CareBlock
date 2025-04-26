// backend/src/models/Record.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const RecordSchema = new Schema({
  clinicId:  { type: Schema.Types.ObjectId, ref: 'Clinic', required: true },
  patientId: { type: String,               required: true },
  ct:        { type: String,               required: true },  // ciphertext
  iv:        { type: String,               required: true },
  authTag:   { type: String,               required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Record', RecordSchema);
