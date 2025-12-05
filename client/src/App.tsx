import { useEffect, useState } from 'react';
import axios from 'axios';
import { Github, Loader2, Terminal, Sparkles, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface User {
  username: string;
  avatarUrl: string;
  name: string;
  pet?: {
    level: number;
    xp: number;
    name: string;
  }
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("System Idle");

  const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;
  const API_URL = import.meta.env.VITE_API_URL;

  const handleLogin = () => {
    setStatus("Initiating Handshake...");
    window.location.assign(
      `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=repo,user`
    );
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      setIsLoading(true);
      setStatus("Decrypting OAuth Token...");
      window.history.replaceState({}, '', window.location.pathname);

      axios.post(`${API_URL}/auth/login`, { code })
        .then(response => {
          setStatus("Summoning Spirit...");
          setTimeout(() => { 
             const { user } = response.data;
             setUser(user);
             setIsLoading(false);
          }, 1500);
        })
        .catch(err => {
          console.error(err);
          setStatus("Connection Failed");
          setIsLoading(false);
        });
    }
  }, []);

  return (
    <div className="relative min-h-screen bg-[#050505] text-zinc-100 flex flex-col items-center justify-center p-6 font-mono overflow-hidden">
      
      {/* --- CAMADA 1: AMBIENTE (BACKGROUND) --- */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />
      
      {/* --- CAMADA ANIMADA: com as orbes  --- */}
      
      {/* Orbe Roxo (Canto Superior Esquerdo) */}
      <motion.div 
        animate={{ 
          x: [0, 50, -50, 0], // Move para direita, esquerda, e volta
          y: [0, -30, 30, 0], // Move para cima, baixo, e volta
          scale: [1, 1.1, 0.9, 1], // Pulsa (aumenta e diminui)
        }}
        transition={{ 
          duration: 20, // Duração longa para ser bem suave e lento
          repeat: Infinity, // Nunca para
          ease: "easeInOut" // Movimento orgânico (não robótico)
        }}
        className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen opacity-70" 
      />

      {/* Orbe Verde (Canto Inferior Direito) */}
      <motion.div 
        animate={{ 
          x: [0, -70, 30, 0], // Movimento oposto ao roxo
          y: [0, 50, -50, 0], 
          scale: [1, 1.2, 0.8, 1],
        }}
        transition={{ 
          duration: 25, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 2 
        }}
        className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-[130px] pointer-events-none mix-blend-screen opacity-70" 
      />

      {/* --- CAMADA 2: INTERFACE --- */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} 
        className="w-full max-w-[420px] relative z-10"
      >
        
        {/* header flutuante */}
        <div className="flex flex-col items-center mb-8 space-y-4">
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

        {/* card principal */}
        <div className="group relative bg-zinc-900/40 border border-white/5 rounded-3xl p-1 overflow-hidden backdrop-blur-xl shadow-2xl">
          
          {/* border gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

          <div className="bg-[#0A0A0A]/90 rounded-[20px] p-8 relative overflow-hidden">
            
            <AnimatePresence mode='wait'>
              {isLoading ? (
                // LOADING STATE
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-12 gap-6"
                >
                  <div className="relative">
                    <div className="w-16 h-16 border-2 border-zinc-800 rounded-full" />
                    <div className="absolute inset-0 border-t-2 border-emerald-500 rounded-full animate-spin" />
                    <Loader2 className="absolute inset-0 w-16 h-16 text-emerald-500/20 animate-pulse p-4" />
                  </div>
                  <p className="text-xs text-emerald-500/80 font-mono animate-pulse">
                    &lt; System.Syncing /&gt;
                  </p>
                </motion.div>

              ) : user ? (
                // LOGGED IN STATE
                <motion.div 
                  key="dashboard"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-8"
                >
                  {/* User Profile */}
                  <div className="flex items-center gap-4">
                    <div className="relative group/avatar">
                      <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500 to-purple-500 rounded-full blur-lg opacity-40 group-hover/avatar:opacity-70 transition-opacity" />
                      <img src={user.avatarUrl} alt="User" className="relative w-16 h-16 rounded-full border-2 border-zinc-800 object-cover" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">{user.name}</h2>
                      <p className="text-zinc-500 text-xs flex items-center gap-1">
                        <Github className="w-3 h-3" /> @{user.username}
                      </p>
                    </div>
                  </div>

                  {/* Stats Grid (Bento Box) */}
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

                  {/* --- ÁREA DO PET --- */}
                  <div className="relative h-48 bg-gradient-to-b from-zinc-900/50 to-zinc-950/50 rounded-2xl border border-zinc-800/50 flex flex-col items-center justify-center overflow-hidden group/pet hover:border-emerald-500/30 transition-all duration-500">
                    
                    {/* Efeitos de Fundo do Card */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent opacity-50" />

                    {/* O ovin */}
                    <motion.div
                      animate={{ 
                        y: [0, -10, 0], // Flutuar
                        filter: ["brightness(1)", "brightness(1.3)", "brightness(1)"] // Brilhar
                      }}
                      transition={{ 
                        duration: 4, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      }}
                      className="relative z-10"
                    >
                      {/* Casca do Ovo */}
                      <div className="w-20 h-28 bg-zinc-900 rounded-[50%_50%_50%_50%_/_60%_60%_40%_40%] border-2 border-emerald-400/50 shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)] flex items-center justify-center overflow-hidden relative">
                        
                        {/* Padrão Digital dentro do ovo */}
                        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(16,185,129,0.1)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%,100%_100%] animate-[shimmer_3s_infinite_linear]" />
                        
                        {/* Núcleo do ovo */}
                        <div className="w-8 h-8 bg-emerald-500 rounded-full blur-md animate-pulse" />
                      </div>

                      {/* Sombra no chão */}
                      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-2 bg-emerald-500/20 blur-md rounded-[100%]" />
                    </motion.div>

                    {/* Texto de Status */}
                    <div className="mt-6 text-center z-10">
                      <h3 className="text-emerald-400 font-bold text-sm tracking-widest uppercase">Spirit Egg</h3>
                      <p className="text-[10px] text-zinc-500 font-mono mt-1">
                        Incubando... Aguardando Commits
                      </p>
                    </div>
                  </div>

                </motion.div>
              ) : (
                // LOGIN STATE
                <motion.div 
                  key="login"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6 text-center"
                >
                  <div className="p-4 bg-emerald-900/10 border border-emerald-500/10 rounded-xl">
                    <p className="text-xs text-emerald-200/70 leading-relaxed">
                      Conecte sua bio-assinatura digital (GitHub) para iniciar a sequência de incubação.
                    </p>
                  </div>

                  <button
                    onClick={handleLogin}
                    className="w-full group relative flex items-center justify-center gap-3 bg-zinc-100 text-black font-bold py-4 px-6 rounded-xl overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    <Github className="w-5 h-5" />
                    <span>Inicializar Protocolo</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-8 flex justify-between items-center px-4 text-[10px] text-zinc-600 uppercase tracking-widest">
          <span>v0.1.0-alpha</span>
          <span className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50"></div>
            Server Online
          </span>
        </div>

      </motion.div>
    </div>
  );
}

export default App;