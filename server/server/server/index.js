require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const mealplanRoutes = require('./routes/mealplan');

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/nutrilearn';

connectDB(MONGO_URI).catch(err => console.error('DB error', err));

app.use('/api/auth', authRoutes);
app.use('/api/mealplan', mealplanRoutes);

app.get('/', (req, res) => res.send('Nutrilearn server running'));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
