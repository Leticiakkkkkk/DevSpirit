import { Trophy, Medal, Crown } from 'lucide-react';
import { SpiritPet } from './SpiritPet';

// Dados Fakes para Visualização (No futuro virá da API)
const MOCK_RANKING = [
  { name: "CodeMaster", xp: 15400, level: 92, avatar: "https://github.com/shadcn.png" },
  { name: "Leticia :)", xp: 12200, level: 75, avatar: "https://github.com/leticiakkkkk.png" }, // Você
  { name: "Rust_Evangelist", xp: 9800, level: 45, avatar: "https://github.com/torvalds.png" },
  { name: "Junior_Dev", xp: 450, level: 5, avatar: "https://github.com/diego3g.png" },
];

export function Leaderboard() {
  return (
    <div className="w-full max-w-md bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 mt-8">
      <div className="flex items-center gap-3 mb-6">
        <Trophy className="text-yellow-500" />
        <h2 className="text-xl font-bold text-white">Top Spirits</h2>
      </div>

      <div className="space-y-4">
        {MOCK_RANKING.map((user, index) => {
          // Lógica de Tier (Insignias)
          let TierIcon = null;
          let tierColor = "text-zinc-500";
          if (index === 0) { TierIcon = Crown; tierColor = "text-yellow-400"; }
          if (index === 1) { TierIcon = Medal; tierColor = "text-zinc-300"; }
          if (index === 2) { TierIcon = Medal; tierColor = "text-amber-700"; }

          return (
            <div key={index} className="flex items-center justify-between p-3 bg-zinc-950/50 rounded-xl border border-white/5 hover:border-white/10 transition-all group">
              <div className="flex items-center gap-4">
                {/* Posição */}
                <div className={`w-6 font-bold text-center ${tierColor}`}>
                  {TierIcon ? <TierIcon size={20} /> : `#${index + 1}`}
                </div>
                
                {/* Avatar + Pet Miniatura */}
                <div className="relative">
                  <img src={user.avatar} className="w-10 h-10 rounded-full border border-zinc-700" />
                  <div className="absolute -bottom-2 -right-2 scale-[0.4]">
                      <SpiritPet level={user.level} xp={0} size="sm" />
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-zinc-200 group-hover:text-white">{user.name}</h4>
                  <p className="text-[10px] text-zinc-500">Lvl {user.level}</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono text-emerald-500 font-bold">{user.xp.toLocaleString()} XP</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}