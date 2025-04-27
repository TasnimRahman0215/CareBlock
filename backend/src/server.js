// backend/src/server.js
require('dotenv').config();

const express   = require('express');
const cors      = require('cors');
const connectDB = require('./connect');
const api       = require('./routes/patientRoute.js');
const patientRoutes = require('./routes/patientRoute.js');

console.log('MONGO_URI=', process.env.MONGO_URI);
console.log('DATA_KEY=', process.env.DATA_KEY?.slice(0,8) + '…');
console.log('JWT_SECRET=', process.env.JWT_SECRET);
console.log('PORT=', process.env.PORT);

const app = express();
app.use(cors({origin: "http://localhost:3000"}));
app.use(express.json());
const checkJwt = require('./middleware/authMiddleware.js');

// Connect to MongoDB
connectDB(process.env.MONGO_URI);

app.use('/api', api);

app.use('/', checkJwt, (req, res) => {
  res.send('Something is running...');
})

app.use('/addPatient', patientRoutes)

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});




