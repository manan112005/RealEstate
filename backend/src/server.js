const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
require('dotenv').config();

const { connectDB } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const locationRoutes = require('./routes/locationRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const contactRoutes = require('./routes/contactRoutes');
const partnerRoutes = require('./routes/partnerRoutes');
const serviceRoutes = require('./routes/serviceRoutes');

const app = express();

// Middleware
app.use(helmet());
const allowedOrigins = process.env.FRONTEND_URL ? [process.env.FRONTEND_URL, 'http://localhost:5173'] : '*';
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'API is running smoothly.' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api', locationRoutes);
app.use('/api', propertyRoutes);
app.use('/api', contactRoutes);
app.use('/api', partnerRoutes);
app.use('/api', serviceRoutes);

const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Connect to DB and start server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
