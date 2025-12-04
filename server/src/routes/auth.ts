import { Router } from 'express';
import axios from 'axios';
import { prisma } from '../lib/prisma';
import jwt from 'jsonwebtoken';

const router = Router();

router.post('/login', async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'GitHub code is required' });
  }

  try {
    // Troca code por token no GitHub
    const { data } = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      {
        headers: {
          Accept: 'application/json',
        },
      }
    );

    if (data.error || !data.access_token) {
      return res.status(400).json({ error: 'GitHub authentication failed' });
    }

    const accessToken = data.access_token;

    // Pega dados do user
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const gitHubUser = userResponse.data;

    // Cria ou atualiza usuário + Cria Pet se for novo
    let user = await prisma.user.upsert({
      where: { githubId: String(gitHubUser.id) },
      update: {
        avatarUrl: gitHubUser.avatar_url,
        username: gitHubUser.login,
        name: gitHubUser.name,
        accessToken: accessToken,
      },
      create: {
        githubId: String(gitHubUser.id),
        username: gitHubUser.login,
        avatarUrl: gitHubUser.avatar_url,
        name: gitHubUser.name,
        accessToken: accessToken,
        pet: {
          create: {
            name: "Ovo Misterioso",
            level: 1,
            xp: 0
          }
        }
      },
    });

    // Gera nosso token JWT
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );

    return res.json({ token, user });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;