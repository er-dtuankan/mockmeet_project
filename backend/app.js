// ─────────────────────────────────────────────────────────────────────────────
// app.js — Express Application Setup
// Middleware stack: helmet → morgan → cors → json → routes → error handler
// ─────────────────────────────────────────────────────────────────────────────
import express from 'express';
import helmet from 'helmet';            // sets secure HTTP response headers
import morgan from 'morgan';            // logs every request: method + url + status
import cors from 'cors';               // cross-origin resource sharing
import { corsOptions } from './src/config/cors.config.js';
import router from './src/routes/index.js'; // master router
import { errorMiddleware } from './src/middlewares/error.middleware.js';

const app = express();

// ── Global Middleware ─────────────────────────────────────────────────────────
app.use(helmet());                      // security headers
app.use(morgan('dev'));                 // request logging (only in dev)
app.use(cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));            // allow frontend origin
app.use(express.json({ limit: '10mb' })); // parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // parse form data

// ── Health Check ──────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'MockMeet API is running 🚀' });
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/v1', router); // all routes prefixed with /api/v1

// ── Global Error Handler (must be LAST middleware) ────────────────────────────
app.use(errorMiddleware);

export { app };
