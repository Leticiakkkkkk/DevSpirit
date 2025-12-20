import { useState } from 'react';
import { motion} from 'framer-motion';
import { Sword, Zap } from 'lucide-react';
import { SpiritPet } from './SpiritPet';

// Tipagem Simples para Batalha
interface BattleUser {
  name: string;
  avatar: string;
  level: number;
  stats: {
    hp: number;
    atk: number;
    classType: "SPECIALIST" | "POLYGLOT"; 
  }
}

export function BattleArena({ myUser, onClose }: { myUser : any, onClose: () => void }) {
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [winner, setWinner] = useState<string | null>(null);
  
  // 1. Simulação do Oponente (Rival)
  const rival: BattleUser = {
    name: "Dark_Dev_99",
    avatar: "https://github.com/shadcn.png",
    level: myUser.pet.level + 2, // Um pouco mais forte para desafiar
    stats: { hp: 100 + (myUser.pet.level * 10), atk: 15, classType: "SPECIALIST" }
  };

  // 2. Definindo os Stats do Usuário (Baseado no GitHub real seria calculado no back)
  const myStats: BattleUser = {
    name: myUser.name,
    avatar: myUser.avatarUrl,
    level: myUser.pet.level,
    stats: { 
      hp: 100 + (myUser.pet.level * 10), 
      atk: 12, 
      classType: "POLYGLOT"
    }
  };

  const [myHp, setMyHp] = useState(myStats.stats.hp);
  const [rivalHp, setRivalHp] = useState(rival.stats.hp);

  // Lógica de Turno
  const playTurn = () => {
    if (winner) return;

    // Turno do Jogador
    let damage = myStats.stats.atk + Math.floor(Math.random() * 5);
    let isCrit = Math.random() > 0.8; 

    setRivalHp(prev => Math.max(0, prev - damage));
    setBattleLog(prev => [`${myStats.name} causou ${damage} de dano! ${isCrit ? 'CRITICAL!' : ''}`, ...prev]);

    if (rivalHp - damage <= 0) {
      setWinner(myStats.name);
      return;
    }

    // Turno do Rival (Com delay para drama)
    setTimeout(() => {
      let rivalDmg = rival.stats.atk;
      if (rival.stats.classType === "SPECIALIST" && Math.random() > 0.6) {
         rivalDmg *= 2.5; 
         setBattleLog(prev => [`⚠️ ${rival.name} usou DEADLY AIM! Dano massivo!`, ...prev]);
      }
      
      setMyHp(prev => Math.max(0, prev - rivalDmg));
      setBattleLog(prev => [`${rival.name} atacou com ${rivalDmg} de dano.`, ...prev]);
      
      if (myHp - rivalDmg <= 0) setWinner(rival.name);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
        
        {/* Header da Arena */}
        <div className="bg-zinc-950 p-4 border-b border-zinc-800 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sword className="text-red-500" /> BATTLE ARENA
          </h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white">ESC</button>
        </div>

        {/* O Palco */}
        <div className="relative p-8 flex justify-between items-center bg-[url('https://grainy-gradients.vercel.app/noise.svg')]">
          
          {/* Jogador (Esquerda) */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
               <SpiritPet level={myStats.level} xp={50} size="md" />
               {myHp < 30 && <div className="absolute inset-0 bg-red-500/20 animate-pulse rounded-full" />}
            </div>
            <div className="text-center">
               <h3 className="font-bold text-white">{myStats.name}</h3>
               <div className="w-32 h-2 bg-zinc-800 rounded-full mt-1 overflow-hidden">
                 <motion.div animate={{ width: `${(myHp / myStats.stats.hp) * 100}%` }} className="h-full bg-emerald-500" />
               </div>
               <span className="text-[10px] text-zinc-500">{myStats.stats.classType}</span>
            </div>
          </div>

          {/* VS */}
          <div className="text-2xl font-black text-zinc-700 italic">VS</div>

          {/* Rival (Direita) */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative grayscale hover:grayscale-0 transition-all">
               <SpiritPet level={rival.level} xp={20} size="md" />
            </div>
            <div className="text-center">
               <h3 className="font-bold text-red-400">{rival.name}</h3>
               <div className="w-32 h-2 bg-zinc-800 rounded-full mt-1 overflow-hidden">
                 <motion.div animate={{ width: `${(rivalHp / rival.stats.hp) * 100}%` }} className="h-full bg-red-500" />
               </div>
               <span className="text-[10px] text-zinc-500">{rival.stats.classType}</span>
            </div>
          </div>
        </div>

        {/* Controles & Log */}
        <div className="p-4 bg-zinc-950/50 border-t border-zinc-800 min-h-[150px] flex gap-4">
           {/* Botões */}
           <div className="flex flex-col gap-2 w-1/3">
             {!winner ? (
               <button onClick={playTurn} className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg flex items-center justify-center gap-2 active:scale-95 transition-all">
                 <Zap size={18} /> ATACAR
               </button>
             ) : (
               <div className="text-center">
                 <p className="text-white font-bold mb-2">{winner === myStats.name ? "VICTORY!" : "DEFEAT..."}</p>
                 <button onClick={onClose} className="w-full py-2 bg-zinc-800 text-white rounded-lg">Voltar</button>
               </div>
             )}
           </div>

           {/* Log de Combate */}
           <div className="flex-1 bg-black/50 rounded-lg p-2 font-mono text-xs text-zinc-400 overflow-y-auto h-32 flex flex-col-reverse">
             {battleLog.map((log, i) => (
               <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="border-b border-white/5 py-1">
                 {log}
               </motion.div>
             ))}
             <div className="text-zinc-600 italic">Batalha iniciada...</div>
           </div>
        </div>
      </div>
    </div>
  );
}