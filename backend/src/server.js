const express = require('express');
const connectDB = require('./connect.js'); // Import the database connection
const patientRoutes = require('./routes/patientRoute.js'); // Import your routes

const dotenv = require('dotenv');
const result = dotenv.config({ path: './backend/.env' });

const app = express();

// Connect to MongoDB
console.log('MONGO_URI:', process.env.MONGO_URI);
connectDB(process.env.MONGO_URI);

app.use(express.json()); // Middleware to parse JSON
app.use('/api', patientRoutes); // Use patient routes

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});