import express, { Express, Request, Response , Application, NextFunction } from 'express';
import dotenv from 'dotenv';
import { errorHandler } from './src/middleware/error.middleware';
import vcRoutes from './src/routes/vc.routes';
import schemaRoutes from './src/routes/schema.routes';
import cors from 'cors'; 


//For env File 
dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8000;

// CORS configuration
const corsOptions = {
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'], // Allow both localhost and IP address
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true  // Allow credentials if you're using cookies/sessions
};

// Apply CORS middleware before other middleware
app.use(cors(corsOptions));


// Middleware
app.use(errorHandler);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/vc', vcRoutes);
app.use('/api/schema', schemaRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Express & TypeScript Server');
});

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}}`);
});
