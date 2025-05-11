import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

// Enable ESM support
import 'source-map-support/register';

// Importar rutas usando path

import actorRoutes from './routes/actorRoutes.js';
import authorRoutes from './routes/authorRoutes.js';
import historyRoutes from './routes/historyRoutes.js';

const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5174',
    'http://localhost:5173',
    '*'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.disable('x-powered-by');
app.use(cors(corsOptions));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/actors', actorRoutes);
app.use('/authors', authorRoutes);
app.use('/histories', historyRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Default route
app.get('*', (req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

export default (req, res) => {
  app(req, res);
};