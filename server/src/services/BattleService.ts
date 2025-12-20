import { prisma } from '../lib/prisma';

interface BattleLog {
  turn: number;
  attacker: string;
  action: "ATTACK" | "CRITICAL" | "MISS";
  damage: number;
  remainingHp: number;
}

export class BattleService {
  
  async executeBattle(heroId: string, rivalId: string) {
    // 1. Buscar os lutadores
    const hero = await prisma.user.findUnique({ where: { id: heroId }, include: { pet: true } });
    const rival = await prisma.user.findUnique({ where: { id: rivalId }, include: { pet: true } });

    if (!hero || !rival) throw new Error("Lutadores não encontrados.");

    // 2. Preparar Stats (Parse do JSON salvo no login)
    const heroStats = JSON.parse(hero.githubStats || '{}');
    const rivalStats = JSON.parse(rival.githubStats || '{}');

    // Vida baseada no GitHub + Nível do Pet
    let heroHp = (heroStats.hp || 100) + (hero.pet?.level || 1) * 5;
    let rivalHp = (rivalStats.hp || 100) + (rival.pet?.level || 1) * 5;

    // Dano base
    const heroDmg = 15 + (hero.pet?.level || 1);
    const rivalDmg = 15 + (rival.pet?.level || 1);

    const logs: BattleLog[] = [];
    let turn = 1;
    let winnerId: string | null = null;

    // 3. O Loop da Morte (Simulação)
    while (heroHp > 0 && rivalHp > 0 && turn <= 20) {
      // -- Turno do Heroi --
      const isHeroCrit = hero.rpgClass === "SPECIALIST" && Math.random() > 0.7; 
      const isRivalDodge = rival.rpgClass === "POLYGLOT" && Math.random() > 0.8; 

      let damageDealt = 0;
      let action: any = "ATTACK";

      if (isRivalDodge) {
        action = "MISS";
      } else {
        damageDealt = Math.floor(heroDmg * (Math.random() * 0.4 + 0.8)); 
        if (isHeroCrit) {
          damageDealt *= 2;
          action = "CRITICAL";
        }
      }

      rivalHp -= damageDealt;
      logs.push({ turn, attacker: hero.username, action, damage: damageDealt, remainingHp: Math.max(0, rivalHp) });

      if (rivalHp <= 0) {
        winnerId = hero.id;
        break;
      }

      // -- Turno do Rival --
      const isRivalCrit = rival.rpgClass === "SPECIALIST" && Math.random() > 0.7;
      const isHeroDodge = hero.rpgClass === "POLYGLOT" && Math.random() > 0.8;

      let rivalDamageDealt = 0;
      let rivalAction: any = "ATTACK";

      if (isHeroDodge) {
        rivalAction = "MISS";
      } else {
        rivalDamageDealt = Math.floor(rivalDmg * (Math.random() * 0.4 + 0.8));
        if (isRivalCrit) {
          rivalDamageDealt *= 2;
          rivalAction = "CRITICAL";
        }
      }

      heroHp -= rivalDamageDealt;
      logs.push({ turn, attacker: rival.username, action: rivalAction, damage: rivalDamageDealt, remainingHp: Math.max(0, heroHp) });

      if (heroHp <= 0) {
        winnerId = rival.id;
        break;
      }

      turn++;
    }

    // 4. Salvar Resultado no Banco
    await prisma.battle.create({
      data: {
        heroId,
        rivalId,
        winnerId,
        log: JSON.stringify(logs)
      }
    });

    // Atualizar stats de vitória/derrota dos usuários
    if (winnerId) {
      const loserId = winnerId === heroId ? rivalId : heroId;
      
      // Vencedor ganha RankScore + XP pro Pet
      await prisma.user.update({
        where: { id: winnerId },
        data: { 
          battlesWon: { increment: 1 },
          rankScore: { increment: 25 },
          pet: { update: { xp: { increment: 50 } } } // Pet upa!
        }
      });

      // Perdedor perde RankScore
      await prisma.user.update({
        where: { id: loserId },
        data: { 
          battlesLost: { increment: 1 },
          rankScore: { decrement: 10 }
        }
      });
    }

    return { winnerId, logs, heroHp, rivalHp };
  }
}