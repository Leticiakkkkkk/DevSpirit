import { useEffect, useState } from 'react';
import axios from 'axios';
import { Github, Loader2, Terminal, Sparkles, Activity, Swords, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SpiritPet } from './components/SpiritPet';
import { BattleArena } from './components/BattleArena';
import { Leaderboard } from './components/Leaderboard';

interface User {
  username: string;
  avatarUrl: string;
  name: string;
  pet?: {
    level: number;
    xp: number;
    name: string;
    isMegaRare?: boolean;
  }
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("System Idle");
  const [showBattle, setShowBattle] = useState(false);
  const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;
  const API_URL = import.meta.env.VITE_API_URL;

  // --- FUNÇÕES DE AUTH ---

  const handleLogin = () => {
    setStatus("Initiating Handshake...");
    window.location.assign(
      `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=repo,user`
    );
  };

  const handleLogout = () => {
    localStorage.removeItem('@devspirit:user');
    setUser(null);
    setShowBattle(false);
    setStatus("System Idle");
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    // CENÁRIO 1: Usuário acabou de voltar do GitHub com o código
    if (code) {
      setIsLoading(true);
      setStatus("Decrypting OAuth Token...");
      window.history.replaceState({}, '', window.location.pathname); // Limpa a URL

      axios.post(`${API_URL}/auth/login`, { code })
        .then(response => {
          setStatus("Summoning Spirit...");
          setTimeout(() => { 
             const { user } = response.data;
             setUser(user);
             // SALVA NO LOCALSTORAGE
             localStorage.setItem('@devspirit:user', JSON.stringify(user));
             setIsLoading(false);
          }, 1500);
        })
        .catch(err => {
          console.error(err);
          setStatus("Connection Failed");
          setIsLoading(false);
        });
    } 
    // CENÁRIO 2: Usuário abriu o site e já estava logado antes
    else {
      const savedUser = localStorage.getItem('@devspirit:user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
        setStatus("Session Restored");
      }
    }
  }, []);

  return (
    <div className="relative min-h-screen bg-[#050505] text-zinc-100 flex flex-col items-center justify-start py-12 px-6 font-mono overflow-y-auto">
      
      {/* --- CAMADA 1: AMBIENTE (BACKGROUND) --- */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      
      {/* ORBES */}
      <motion.div 
        animate={{ x: [0, 50, -50, 0], y: [0, -30, 30, 0], scale: [1, 1.1, 0.9, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen opacity-70" 
      />
      <motion.div 
        animate={{ x: [0, -70, 30, 0], y: [0, 50, -50, 0], scale: [1, 1.2, 0.8, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="fixed bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-[130px] pointer-events-none mix-blend-screen opacity-70" 
      />

      {/* --- CAMADA 2: INTERFACE --- */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} 
        className="w-full max-w-[420px] relative z-10 flex flex-col gap-8"
      >
        
        {/* HEADER */}
        <div className="flex flex-col items-center space-y-4">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 180 }}
            transition={{ duration: 0.5 }}
            className="p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800/50 shadow-[0_0_30px_-10px_rgba(16,185,129,0.3)] backdrop-blur-md"
          >
            <Terminal className="w-6 h-6 text-emerald-400" />
          </motion.div>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-zinc-200 to-zinc-600">
              DevSpirit
            </h1>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isLoading ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isLoading ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
              </span>
              <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-semibold">
                {status}
              </p>
            </div>
          </div>
        </div>

        {/* CARD PRINCIPAL */}
        <div className="group relative bg-zinc-900/40 border border-white/5 rounded-3xl p-1 overflow-hidden backdrop-blur-xl shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

          <div className="bg-zinc-950/40 backdrop-blur-xl border border-white/10 rounded-[20px] p-8 relative overflow-hidden shadow-2xl">
            <AnimatePresence mode='wait'>
              {isLoading ? (
                // LOADING STATE
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-12 gap-6">
                  <div className="relative">
                    <div className="w-16 h-16 border-2 border-zinc-800 rounded-full" />
                    <div className="absolute inset-0 border-t-2 border-emerald-500 rounded-full animate-spin" />
                    <Loader2 className="absolute inset-0 w-16 h-16 text-emerald-500/20 animate-pulse p-4" />
                  </div>
                  <p className="text-xs text-emerald-500/80 font-mono animate-pulse">&lt; System.Syncing /&gt;</p>
                </motion.div>
              ) : user ? (
                // LOGGED IN STATE
                <motion.div key="dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-8">
                  
                  {/* HEADER DO USUÁRIO + LOGOUT */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative group/avatar">
                        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500 to-purple-500 rounded-full blur-lg opacity-40 group-hover/avatar:opacity-70 transition-opacity" />
                        <img src={user.avatarUrl} alt="User" className="relative w-16 h-16 rounded-full border-2 border-zinc-800 object-cover" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-white">{user.name}</h2>
                        <p className="text-zinc-500 text-xs flex items-center gap-1"><Github className="w-3 h-3" /> @{user.username}</p>
                      </div>
                    </div>
                    
                    {/* BOTÃO DE LOGOUT AQUI */}
                    <button 
                      onClick={handleLogout}
                      className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Disconnect"
                    >
                      <LogOut size={20} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-zinc-900/50 border border-zinc-800/50 p-4 rounded-xl hover:border-emerald-500/30 transition-colors group/card">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Level</span>
                        <Sparkles className="w-3 h-3 text-emerald-500 opacity-50 group-hover/card:opacity-100" />
                      </div>
                      <span className="text-2xl font-bold text-white">{user.pet?.level || 1}</span>
                    </div>

                    <div className="bg-zinc-900/50 border border-zinc-800/50 p-4 rounded-xl hover:border-purple-500/30 transition-colors group/card">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] text-zinc-500 uppercase tracking-wider">XP Total</span>
                        <Activity className="w-3 h-3 text-purple-500 opacity-50 group-hover/card:opacity-100" />
                      </div>
                      <span className="text-2xl font-bold text-white">{user.pet?.xp || 0}</span>
                    </div>
                  </div>

                  {/* ÁREA DO PET */}
                  <div className="mt-6 w-full">
                    <SpiritPet 
                      level={user.pet?.level || 1} 
                      xp={user.pet?.xp || 0} 
                      isMegaRare={user.pet?.isMegaRare}
                    />
                  </div>
                  
                  {/* BOTÃO DE BATALHA */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowBattle(true)}
                    className="w-full py-4 mt-4 bg-gradient-to-r from-red-900/50 to-red-600/20 border border-red-500/30 rounded-xl flex items-center justify-center gap-2 group/btn hover:border-red-500 transition-all"
                  >
                    <Swords className="w-5 h-5 text-red-400 group-hover/btn:animate-pulse" />
                    <span className="text-red-100 font-bold tracking-widest text-sm">PVP ARENA</span>
                  </motion.button>

                </motion.div>
              ) : (
                // LOGIN STATE
                <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 text-center">
                  <div className="p-4 bg-emerald-900/10 border border-emerald-500/10 rounded-xl">
                    <p className="text-xs text-emerald-200/70 leading-relaxed">Conecte sua bio-assinatura digital (GitHub) para iniciar a sequência de incubação.</p>
                  </div>
                  <button onClick={handleLogin} className="w-full group relative flex items-center justify-center gap-3 bg-zinc-100 text-black font-bold py-4 px-6 rounded-xl overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98]">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    <Github className="w-5 h-5" />
                    <span>Inicializar Protocolo</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        {/* RANKING (LEADERBOARD) */}
        {user && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Leaderboard />
          </motion.div>
        )}

        {/* Footer info */}
        <div className="flex justify-between items-center px-4 text-[10px] text-zinc-600 uppercase tracking-widest pb-8">
          <span>v0.2.0-beta</span>
          <span className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50"></div>
            Server Online
          </span>
        </div>

      </motion.div>

      {/* --- OVERLAYS (MODAIS) --- */}
      <AnimatePresence>
        {showBattle && user && (
          <BattleArena myUser={user} onClose={() => setShowBattle(false)} />
        )}
      </AnimatePresence>

    </div>
  );
}

export default App;