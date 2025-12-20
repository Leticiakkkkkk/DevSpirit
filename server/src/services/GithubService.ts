import axios from 'axios';

interface RPGStats {
  classType: "SPECIALIST" | "POLYGLOT";
  hp: number;
  attributes: any;
export class GithubService {
  
  // Analisa o perfil e retorna os Stats de RPG
  async calculateRPGStats(accessToken: string, username: string): Promise<RPGStats> {
    try {
      // 1. Buscar dados básicos do user
      const { data: user } = await axios.get('https://api.github.com/user', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      // 2. Buscar repositórios (limited 50)
      const { data: repos } = await axios.get('https://api.github.com/user/repos?sort=updated&per_page=50', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      // --- CÁLCULO DE CLASSE (Lógica de Maestria) ---
      const languageCounts: Record<string, number> = {};
      let totalReposWithLang = 0;

      repos.forEach((repo: any) => {
        if (repo.language) {
          languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
          totalReposWithLang++;
        }
      });

      // Descobre a linguagem mais usada
      let topLang = "";
      let maxCount = 0;

      Object.entries(languageCounts).forEach(([lang, count]) => {
        if (count > maxCount) {
          maxCount = count;
          topLang = lang;
        }
      });

      // Se 60% ou mais dos repositórios são da mesma linguagem = SPECIALIST
      // Caso contrário = POLYGLOT
      const dominance = totalReposWithLang > 0 ? (maxCount / totalReposWithLang) : 0;
      const classType = dominance >= 0.6 ? "SPECIALIST" : "POLYGLOT";

      // --- CÁLCULO DE HP (Vida) ---
      // Fórmula: (Repos * 10) + (Seguidores * 5) + (Dias de conta / 10)
      const daysSinceCreation = Math.floor((new Date().getTime() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24));
      const hp = (user.public_repos * 10) + (user.followers * 5) + Math.floor(daysSinceCreation / 10);

      console.log(`[RPG] User ${username} -> Class: ${classType} (${(dominance * 100).toFixed(0)}% ${topLang}) | HP: ${hp}`);

      return {
        classType,
        hp,
        attributes: {
          topLang,
          dominance,
          totalRepos: user.public_repos,
          followers: user.followers
        }
      };

    } catch (error) {
      console.error("Erro ao calcular stats do GitHub:", error);
      return { classType: "POLYGLOT", hp: 100, attributes: {} };
    }
  }
}