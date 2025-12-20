import express from 'express';
import cors from 'cors';
import { authRoutes } from './routes/auth'; 
import { battleRoutes } from './routes/battle';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/battle', battleRoutes);

export { app };