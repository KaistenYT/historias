import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';



// Importar rutas usando path

import actorRoutes from './routes/actorRoutes.js';
import authorRoutes from './routes/authorRoutes.js';
import historyRoutes from './routes/historyRoutes.js';

const corsOptions = {
  origin: true, // Permite cualquier origen
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Content-Length', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Content-Length'],
  maxAge: 3600,
  preflightContinue: false,
  optionsSuccessStatus: 204,
  // Asegurarse de que el proxy funcione correctamente
  preflight: (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept');
    next();
  }
};

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.disable('x-powered-by');

// Configurar CORS antes de cualquier ruta
app.use(cors(corsOptions));

// Middleware para manejar opciones CORS
app.options('*', cors());

// Middleware para manejar peticiones preflight
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept');
  next();
});

// Middleware para JSON
app.use(bodyParser.json());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
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