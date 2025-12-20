import { Request, Response } from 'express';
import axios from 'axios';
import { prisma } from '../lib/prisma';
import { GithubService } from '../services/GithubService'; // <--- Import novo

export const loginGithub = async (req: Request, res: Response) => {
  const { code } = req.body;

  try {
    // 1. Troca o código pelo Token de Acesso
    const { data: accessTokenResponse } = await axios.post(
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

    const accessToken = accessTokenResponse.access_token;

    // 2. Busca dados do Usuário no GitHub
    const { data: githubUser } = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    // 3. CALCULA OS STATS DE RPG ---
    const githubService = new GithubService();
    const rpgStats = await githubService.calculateRPGStats(accessToken, githubUser.login);

    // 4. Salva ou Atualiza no Banco (Com os novos campos)
    let user = await prisma.user.findUnique({
      where: { githubId: String(githubUser.id) },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          githubId: String(githubUser.id),
          username: githubUser.login,
          name: githubUser.name || githubUser.login,
          avatarUrl: githubUser.avatar_url,
          rpgClass: rpgStats.classType,           // to class
          githubStats: JSON.stringify(rpgStats),  // to details
          pet: {
            create: {
              level: 1,
              xp: 0,
              isMegaRare: Math.random() > 0.95 // 5% de chance de nascer Mega Raro
            }
          }
        },
      });
    } else {
      // Se usuário já existe, atualiza os stats para manter sincronizado
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          rpgClass: rpgStats.classType,
          githubStats: JSON.stringify(rpgStats),
          lastSyncedAt: new Date()
        }
      });
    }

    // Busca o pet para retornar junto
    const userWithPet = await prisma.user.findUnique({
      where: { id: user.id },
      include: { pet: true }
    });

    return res.json({ user: userWithPet, token: accessToken });

  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: 'Falha na autenticação' });
  }
};