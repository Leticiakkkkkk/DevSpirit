import { Router, Request, Response } from 'express';
import axios from 'axios';
import { prisma } from '../lib/prisma';
import { GithubService } from '../services/GithubService';

const router = Router();

router.post('/login', async (req: Request, res: Response): Promise<any> => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Código do GitHub é obrigatório.' });
    }

    const accessTokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      null,
      {
        params: {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        },
        headers: { Accept: 'application/json' },
      }
    );

    const { access_token } = accessTokenResponse.data;

    if (!access_token) {
      return res.status(400).json({ error: 'Falha ao obter token do GitHub.' });
    }

    const userResponse = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const githubUser = userResponse.data;
    const githubService = new GithubService();
    const rpgStats = await githubService.calculateRPGStats(access_token, githubUser.login);

    let user = await prisma.user.findUnique({
      where: { githubId: String(githubUser.id) }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          githubId: String(githubUser.id),
          username: githubUser.login,
          name: githubUser.name || githubUser.login,
          avatarUrl: githubUser.avatar_url,
          rpgClass: rpgStats.classType,
          githubStats: JSON.stringify(rpgStats),
          pet: {
            create: {
              name: "Ovo Misterioso",
              level: 1,
              xp: 0,
              isMegaRare: Math.random() > 0.95 
            }
          }
        }
      });
    } else {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          avatarUrl: githubUser.avatar_url,
          rpgClass: rpgStats.classType,
          githubStats: JSON.stringify(rpgStats),
          lastSyncedAt: new Date()
        }
      });
    }

    const userWithPet = await prisma.user.findUnique({
      where: { id: user.id },
      include: { pet: true }
    });

    return res.json({ user: userWithPet, token: access_token });

  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
});

// AQUI ESTAVA O PROBLEMA: Exportação nomeada explícita
export { router as authRoutes };