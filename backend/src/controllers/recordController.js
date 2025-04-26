// backend/src/controllers/recordController.js
const Record = require('../models/Record');
const { encrypt, decrypt } = require('../utils/encrypt');
const crypto = require('crypto');

exports.addRecord = async (req, res) => {
  try {
    const { patientId, data } = req.body;
    const clinicId = req.header('x-clinic-id');
    const { ct, iv, authTag } = encrypt(data);
    const rec = await Record.create({ clinicId, patientId, ct, iv, authTag });
    res.status(201).json({ recordId: rec._id.toString() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add record.' });
  }
};

exports.getRecord = async (req, res) => {
  try {
    const rec = await Record.findById(req.params.recordId);
    if (!rec) return res.status(404).json({ error: 'Record not found.' });
    const plain = decrypt({ ct: rec.ct, iv: rec.iv, authTag: rec.authTag });
    res.json({ ...plain, createdAt: rec.createdAt });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get record.' });
  }
};

exports.auditRecord = async (req, res) => {
  try {
    const rec = await Record.findById(req.params.recordId);
    if (!rec) return res.status(404).json({ error: 'Record not found.' });
    const hash = crypto
      .createHash('sha256')
      .update(rec.ct + rec.iv + rec.authTag)
      .digest('hex');
    res.json({ hash });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to audit record.' });
  }
};
