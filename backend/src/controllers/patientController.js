const crypto = require('crypto');
const Patient = require('../models/patient'); // Assuming you have a Patient model

// AES encryption key (should be securely stored in production)
const aesKey = crypto.randomBytes(32); // 256-bit key

// Function to encrypt data
function encryptWithAES(data, key) {
    const iv = crypto.randomBytes(16); // Random IV
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    const jsonString = JSON.stringify(data); // Convert JSON to string
    let encrypted = cipher.update(jsonString, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return { encryptedData: encrypted, iv: iv.toString('hex') };
}

// POST route to add a new patient
const addPatient = async (req, res) => {
    try {
        const patientData = req.body; // Get patient data from request body

        // Encrypt the patient data
        const { encryptedData, iv } = encryptWithAES(patientData, aesKey);

        // Create a new patient document
        const newPatient = new Patient({
            encryptedData,
            iv,
        });

        // Save the patient document to MongoDB
        await newPatient.save();

        res.status(201).json({ message: 'Patient data encrypted and stored successfully.' });
    } catch (error) {
        console.error('Error adding patient:', error);
        res.status(500).json({ error: 'Failed to add patient.' });
    }
};

module.exports = { addPatient };