import { Router, Request, Response } from 'express';
import { BattleService } from '../services/BattleService';
import { prisma } from '../lib/prisma';

const router = Router();

// POST /battle/challenge -> Inicia uma luta
router.post('/challenge', async (req: Request, res: Response): Promise<any> => {
  const { heroId, rivalId } = req.body;

  if (!heroId || !rivalId) {
    return res.status(400).json({ error: "IDs inválidos" });
  }

  if (heroId === rivalId) {
    return res.status(400).json({ error: "Você não pode lutar contra si mesmo (ainda)." });
  }

  try {
    const battleService = new BattleService();
    const result = await battleService.executeBattle(heroId, rivalId);
    
    return res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro na arena de batalha" });
  }
});

// GET /battle/ranking -> Retorna o Top 10 Real
router.get('/ranking', async (req, res) => {
  const ranking = await prisma.user.findMany({
    take: 10,
    orderBy: { rankScore: 'desc' },
    include: { pet: true },
    where: { username: { not: undefined } } 
  });

  return res.json(ranking);
});

export { router as battleRoutes };