import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';

dotenv.config();

const app = express();

app.use(cors()); // aq é para permitir conexão com o front
app.use(express.json());

// Rotas
app.use('/auth', authRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'ok', server: 'DevSpirit API' });
});

export default app;