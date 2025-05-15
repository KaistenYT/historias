import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';



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
    'https://eco-museo-api.vercel.app',
    'https://historias-api-crud.vercel.app',
    '*'
  ]
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

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  
  if (err.name === 'AxiosError') {
    return res.status(500).json({
      success: false,
      error: 'Network error occurred',
      message: 'Please check the server connection'
    });
  }

  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
    message: err.message || 'Something went wrong!'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `Route ${req.method} ${req.url} not found`
  });
});

// Routes
app.use('/actors', actorRoutes);
app.use('/authors', authorRoutes);
app.use('/histories', historyRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Export the app
export default (req, res) => {
  app(req, res);
};