import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { X, Swords, Zap } from 'lucide-react';

// Tipagem das props recebidas do App.tsx
interface BattleArenaProps {
  myUser: any;
  rivalUser: any; // <--- AGORA ESTAMOS RECEBENDO O RIVAL CORRETAMENTE
  onClose: () => void;
}

export function BattleArena({ myUser, rivalUser, onClose }: BattleArenaProps) {
  const [displayLogs, setDisplayLogs] = useState<any[]>([]);
  const [winner, setWinner] = useState<string | null>(null);
  const [isBattling, setIsBattling] = useState(false);

  // Vida Visual (Começa em 100%)
  const [heroHp, setHeroHp] = useState(100);
  const [rivalHp, setRivalHp] = useState(100);

  // Função que inicia a batalha REAL no servidor
  const startBattle = async () => {
    setIsBattling(true);
    try {
      // 1. Chama o Backend Real
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/battle/challenge`, {
        heroId: myUser.id,
        rivalId: rivalUser.id // <--- Manda o ID da laetit1a, não do bot
      });

      // 2. Recebe o resultado da luta
      const { logs: battleLogs, winnerId } = response.data;
      setWinner(winnerId);
      
      // 3. Toca a animação (Replay)
      let currentTurn = 0;
      
      const interval = setInterval(() => {
        if (currentTurn >= battleLogs.length) {
          clearInterval(interval);
          setIsBattling(false);
          return;
        }

        const log = battleLogs[currentTurn];
        
        setDisplayLogs(prev => [...prev, log]);
        
        // Atualiza as barras de vida
        if (log.remainingHp !== undefined) {
           const damage = log.damage || 0;
           if (log.attacker === myUser.username) {
             setRivalHp(prev => Math.max(0, prev - damage)); 
           } else {
             setHeroHp(prev => Math.max(0, prev - damage));
           }
        }

        currentTurn++;
      }, 800); 

    } catch (err) {
      console.error(err);
      alert("Erro ao conectar na Arena. Verifique o servidor.");
      setIsBattling(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl relative">
        
        {/* Header */}
        <div className="bg-zinc-950 p-4 border-b border-zinc-800 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Swords className="text-red-500" /> BATTLE ARENA
          </h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white"><X /></button>
        </div>

        {/* O Palco */}
        <div className="relative p-8 flex justify-between items-center bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-90">
          
          {/* VOCÊ (ESQUERDA) */}
          <div className="flex flex-col items-center gap-4 relative">
             <motion.img 
               animate={isBattling ? { x: [0, 10, 0] } : {}}
               src={myUser.avatarUrl} 
               className="w-24 h-24 rounded-full border-4 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)] object-cover"
             />
             <div className="text-center">
               <h3 className="font-bold text-emerald-100">{myUser.username}</h3>
               <div className="w-32 h-2 bg-zinc-800 rounded-full mt-2 overflow-hidden">
                 <motion.div 
                   animate={{ width: `${heroHp > 100 ? 100 : heroHp}%` }} 
                   className="h-full bg-emerald-500 transition-all duration-300" 
                 />
               </div>
             </div>
          </div>

          <div className="text-2xl font-black text-zinc-700 italic">VS</div>

          {/* RIVAL REAL (DIREITA) */}
          <div className="flex flex-col items-center gap-4 relative">
             <motion.img 
               animate={isBattling ? { x: [0, -10, 0] } : {}}
               src={rivalUser.avatarUrl} 
               className="w-24 h-24 rounded-full border-4 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)] object-cover"
             />
             <div className="text-center">
               <h3 className="font-bold text-red-100">{rivalUser.username}</h3>
               <div className="w-32 h-2 bg-zinc-800 rounded-full mt-2 overflow-hidden">
                 <motion.div 
                   animate={{ width: `${rivalHp > 100 ? 100 : rivalHp}%` }} 
                   className="h-full bg-red-500 transition-all duration-300" 
                 />
               </div>
             </div>
          </div>
        </div>

        {/* Controles & Log */}
        <div className="p-4 bg-zinc-950/50 border-t border-zinc-800 min-h-[150px] flex gap-4">
           {/* Botão de Ação */}
           <div className="flex flex-col gap-2 w-1/3 justify-center">
             {!winner && !isBattling && displayLogs.length === 0 && (
               <button onClick={startBattle} className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg animate-pulse">
                 <Zap size={18} /> INICIAR
               </button>
             )}
             
             {isBattling && (
                <div className="text-center text-zinc-500 text-xs animate-pulse">
                   Calculando Batalha...
                </div>
             )}

             {winner && (
               <div className="text-center animate-in zoom-in duration-300">
                 <p className={`font-black text-xl mb-2 ${winner === myUser.id ? "text-yellow-400" : "text-red-500"}`}>
                   {winner === myUser.id ? "VICTORY!" : "DEFEAT..."}
                 </p>
                 <button onClick={onClose} className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm">
                   Voltar
                 </button>
               </div>
             )}
           </div>

           {/* Log de Combate */}
           <div className="flex-1 bg-black rounded-lg p-3 font-mono text-xs overflow-y-auto h-32 flex flex-col-reverse border border-zinc-800">
             {displayLogs.length === 0 && !winner && <span className="text-zinc-600 italic">Aguardando início do protocolo...</span>}
             
             {[...displayLogs].reverse().map((log, i) => (
               <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mb-1">
                 <span className={log.attacker === myUser.username ? "text-emerald-500 font-bold" : "text-red-500 font-bold"}>
                   {log.attacker}
                 </span>
                 <span className="text-zinc-400">
                    {log.action === "CRITICAL" ? " CRITICALLY hits for " : " attacks for "}
                 </span>
                 <span className="text-white font-bold">{log.damage} DMG</span>
               </motion.div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
}