import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import userRoutes from '../routes/userRoutes'; // Import user routes

const app: Application = express();

// Middleware
app.use(cors()); // ✅ Enable CORS for frontend communication
app.use(express.json()); // ✅ Parse JSON request body
app.use(express.urlencoded({ extended: true })); // ✅ Parse URL-encoded data (optional)

// Health check endpoint
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'API is running 🚀' });
});

// API routes
app.use('/api', userRoutes); // ✅ Use the userRoutes under /api path


export default app;