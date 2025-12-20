import { Router } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

router.post('/github', async (req, res) => {
  try {
    const payload = req.body;
    const githubUsername = payload.sender?.login;
    const commits = payload.commits || [];

    if (!githubUsername || commits.length === 0) {
      return res.status(200).send("Ignored: No commits or username found.");
    }

    console.log(`🔔 Evento recebido! ${githubUsername} fez ${commits.length} commits.`);

    // para localizar o dono do pet no bd
    const user = await prisma.user.findFirst({
      where: { username: githubUsername },
      include: { pet: true }
    });

    if (!user || !user.pet) {
      console.log("Usuário ou Pet não encontrados no sistema.");
      return res.status(200).send("User not registered in DevSpirit.");
    }

    // calculo de XP (10XP por commit)
    const xpEarned = commits.length * 10;
    
    let newXp = user.pet.xp + xpEarned;
    let newLevel = user.pet.level;

    // aqui é a lógica dos niveis
    if (newXp >= 100) {
      newLevel += Math.floor(newXp / 100);
      newXp = newXp % 100; // O resto fica como XP atual
      console.log(`🎉 LEVEL UP! O Pet de ${user.username} subiu para o nível ${newLevel}!`);
    }

    // atualização do pet no bd
    await prisma.pet.update({
      where: { id: user.pet.id },
      data: {
        xp: newXp,
        level: newLevel,
        lastCommitAt: new Date(),
        happiness: { increment: 5 } 
      }
    });

    // Registrar a atividade para o histórico
    await prisma.commitActivity.create({
      data: {
        petId: user.pet.id,
        commitHash: payload.head_commit?.id || "unknown",
        message: payload.head_commit?.message || "No message",
        repoName: payload.repository?.full_name || "unknown",
        committedAt: new Date(),
        xpEarned: xpEarned
      }
    });

    console.log(`✅ Sucesso! +${xpEarned} XP para o pet.`);
    return res.json({ success: true, xpEarned });

  } catch (error) {
    console.error("Erro no Webhook:", error);
    return res.status(500).json({ error: "Internal Error" });
  }
});

export default router;