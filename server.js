import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';



// Importar rutas usando path

import actorRoutes from './routes/actorRoutes.js';
import authorRoutes from './routes/authorRoutes.js';
import historyRoutes from './routes/historyRoutes.js';



const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.disable('x-powered-by');
app.use(cors({
  origin: ['https://eco-museo-api.vercel.app',
    'http://localhost:5173',
    'http://localhost:5174',
    'https://historias-v2-api.vercel.app',
    'https://historias-v2-api-git-cambios-para-la-45d328-kaistenyts-projects.vercel.app'
  ], // Ensure this is the exact origin of your frontend
  methods: 'GET, POST, PUT, DELETE, OPTIONS',
  allowedHeaders: 'Content-Type, Authorization',
  credentials: true // This is the critical part
}));


// Configura el límite para las peticiones JSON
app.use(express.json({ limit: '5mb' })); // Asegúrate de que este límite sea suficiente

// Configura el límite para las peticiones URL-encoded (si las usas)
app.use(express.urlencoded({ limit: '5mb', extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/actors', actorRoutes);
app.use('/authors', authorRoutes);
app.use('/histories', historyRoutes);

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

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    error: err.message || 'Internal Server Error',
    message: err.message || 'Something went wrong!' 
  });
});
//solo para pruebas
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

// Export the app
export default app;