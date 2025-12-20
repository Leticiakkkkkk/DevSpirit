import { useEffect, useState } from 'react';
import axios from 'axios';
import { Trophy, Swords, Medal } from 'lucide-react';
import { motion } from 'framer-motion';

// Tipagem real vinda do Backend
interface User {
  id: string;
  username: string;
  avatarUrl: string;
  pet?: { 
    level: number;
    isMegaRare?: boolean;
  };
  battlesWon: number;
  rankScore: number;
}

interface LeaderboardProps {
  // Recebe a função do App.tsx para abrir a batalha
  onChallenge?: (rival: User) => void;
}

export function Leaderboard({ onChallenge }: LeaderboardProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // BUSCA O RANKING REAL
    axios.get(`${import.meta.env.VITE_API_URL}/battle/ranking`)
      .then(res => {
        setUsers(res.data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Erro ao buscar ranking:", err);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="w-full max-w-[420px] p-6 text-center text-zinc-500 text-xs animate-pulse">
        Carregando dados da rede neural...
      </div>
    );
  }

  // ... (começo do arquivo igual)

  return (
    <div className="w-full max-w-[420px] bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden">
      {/* Detalhe visual de fundo */}
      <div className="absolute top-0 right-0 p-10 bg-amber-500/10 blur-[50px] rounded-full pointer-events-none" />

      <div className="flex items-center gap-2 mb-6 text-amber-400 relative z-10">
        <Trophy className="w-5 h-5" />
        <h3 className="font-bold tracking-widest text-sm">TOP SPIRITS (GLOBAL)</h3>
      </div>

      <div className="space-y-3 relative z-10">
        {users.length === 0 ? (
          <p className="text-zinc-500 text-sm text-center py-4">Nenhum guerreiro encontrado.</p>
        ) : (
          users.map((user, index) => (
            <motion.div 
              key={user.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group flex items-center justify-between p-3 rounded-xl bg-black/40 hover:bg-zinc-800/50 transition-all border border-transparent hover:border-zinc-700 cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className={`w-6 text-center font-bold text-lg ${
                  index === 0 ? 'text-amber-400' : 
                  index === 1 ? 'text-zinc-300' : 
                  index === 2 ? 'text-amber-700' : 'text-zinc-600'
                }`}>
                  {index + 1}
                </div>

                <div className="relative">
                  <img src={user.avatarUrl} alt={user.username} className="w-10 h-10 rounded-full border border-zinc-700 object-cover" />
                  {index === 0 && <Medal className="w-4 h-4 text-amber-400 absolute -top-1 -right-1 drop-shadow-lg" />}
                </div>

                <div>
                  <p className="text-sm font-bold text-zinc-200 group-hover:text-white transition-colors">
                    {user.username}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                    <span className="bg-zinc-800 px-1.5 rounded text-zinc-400">Lvl. {user.pet?.level || 1}</span>
                    <span>{user.battlesWon} vitórias</span>
                  </div>
                </div>
              </div>

              {/* BOTÃO AGORA SEMPRE VISÍVEL */}
              {onChallenge && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onChallenge(user);
                  }}
                  className="p-2 rounded-full bg-red-500/20 text-red-500 hover:bg-red-600 hover:text-white hover:scale-110 transition-all shadow-lg animate-pulse"
                  title="Desafiar para Duelo"
                >
                  <Swords size={18} />
                </button>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}