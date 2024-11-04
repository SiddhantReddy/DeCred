import express, { Express, Request, Response , Application } from 'express';
import dotenv from 'dotenv';
import { errorHandler } from './src/middleware/error.middleware';
import vcRoutes from './src/routes/vc.routes';
import schemaRoutes from './src/routes/schema.routes';

//For env File 
dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8000;


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
