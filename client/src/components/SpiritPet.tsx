import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface SpiritPetProps {
  level: number;
  xp: number;
  isMegaRare?: boolean;
  size?: "sm" | "md" | "lg"; 
}

export function SpiritPet({ level, xp, isMegaRare = false, size = "lg" }: SpiritPetProps) {
  
  // --- CONFIGURAÇÃO VISUAL ---
  const hueShift = (level * 25) % 360; 
  const sizeScale = size === "lg" ? 1 : size === "md" ? 0.6 : 0.4;
  const primaryColor = isMegaRare ? '#fbbf24' : `hsl(${150 + hueShift}, 100%, 60%)`;
  const secondaryColor = isMegaRare ? '#d97706' : `hsl(${180 + hueShift}, 100%, 50%)`;
  const glowColor = isMegaRare ? 'rgba(251, 191, 36, 0.6)' : `hsla(${150 + hueShift}, 100%, 60%, 0.6)`;
  // render dos states
  const renderForm = () => {
// 0-9: DATA BIT (Pixel Instável)
    if (level < 10) return (
      <div className="relative flex items-center justify-center">
        <motion.div 
          animate={{ scale: [1, 1.3, 0.9, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }} 
          className="w-10 h-10 shadow-[0_0_20px_currentColor]"
          style={{ backgroundColor: primaryColor, color: glowColor }}
        />
        <motion.div 
          animate={{ opacity: [0, 1, 0], x: [-10, 10] }} 
          transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 2 }}
          className="absolute w-12 h-1 bg-white mix-blend-overlay"
        />
      </div>
    );
    // 10-19: DATA CLUSTER (Sistema Solar)
    if (level < 20) return (
      <div className="relative w-32 h-32 flex items-center justify-center">
        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 3, repeat: Infinity }} 
          className="w-12 h-12 rounded-full blur-md" style={{ background: primaryColor, boxShadow: `0 0 40px ${glowColor}` }} />
        {[0, 1, 2].map(i => (
          <motion.div key={i} animate={{ rotate: 360 }} transition={{ duration: 3 + i, repeat: Infinity, ease: "linear" }} className="absolute w-full h-full">
            <div className="w-4 h-4 rounded-full blur-sm absolute top-0 left-1/2" style={{ background: secondaryColor, opacity: 0.7 }} />
          </motion.div>
        ))}
      </div>
    );

    // 20-29: NEURAL NODE (Rede Conectada)
    if (level < 30) return (
      <div className="relative w-32 h-32 flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} 
          className="absolute w-24 h-24 border-2 border-dashed rounded-full opacity-40" style={{ borderColor: primaryColor }} />
        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} 
          className="w-16 h-16 rounded-full border-4 flex items-center justify-center" style={{ borderColor: secondaryColor, background: `${primaryColor}20` }}>
          <div className="w-4 h-4 rounded-full" style={{ background: primaryColor, boxShadow: `0 0 20px ${primaryColor}` }} />
        </motion.div>
      </div>
    );

    // 30-39: CRYSTAL SHARD (Triângulo Flutuante)
    if (level < 40) return (
      <motion.div animate={{ y: [-10, 10, -10], rotateY: [0, 180, 360] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="relative">
        <div className="w-0 h-0 border-l-[30px] border-r-[30px] border-b-[50px] border-l-transparent border-r-transparent filter drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]" 
          style={{ borderBottomColor: primaryColor }} />
        <div className="absolute top-4 left-[-15px] w-0 h-0 border-l-[15px] border-r-[15px] border-b-[25px] border-l-transparent border-r-transparent opacity-50 mix-blend-screen"
          style={{ borderBottomColor: 'white' }} />
      </motion.div>
    );

    // 40-49: LIQUID FLUX (Gosma Viva)
    if (level < 50) return (
      <div className="relative">
        <motion.div 
          animate={{ borderRadius: ["50%", "40% 60% 70% 30%", "30% 70% 50% 50%", "50%"], rotate: [0, 180, 360] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="w-24 h-24 backdrop-blur-md border opacity-80"
          style={{ background: `linear-gradient(45deg, ${primaryColor}, ${secondaryColor})`, borderColor: 'white', boxShadow: `inset 0 0 20px ${glowColor}` }}
        />
        <div className="absolute inset-0 border-2 border-white/20 rounded-full animate-ping" />
      </div>
    );

    // 50-59: POWER CORE (Reator)
    if (level < 60) return (
      <div className="relative flex items-center justify-center">
        <div className="w-20 h-20 rounded-full border-4 border-double animate-spin-slow opacity-50" style={{ borderColor: primaryColor }} />
        <div className="absolute w-24 h-24 border border-white/20 rounded-full animate-ping delay-700" />
        <motion.div animate={{ scale: [1, 1.5, 0.8, 1] }} transition={{ duration: 0.5, repeat: Infinity }} 
          className="w-8 h-8 rounded-full blur-md z-10" style={{ background: 'white', boxShadow: `0 0 50px ${primaryColor}` }} />
      </div>
    );

    // 60-69: HYPER PRISM (Hexágono 3D)
    if (level < 70) return (
      <div className="relative w-32 h-32 flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute inset-0 border border-white/10 clip-path-hexagon" />
        <motion.div animate={{ rotate: -360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="absolute w-20 h-20 border-2 clip-path-hexagon" style={{ borderColor: primaryColor }} />
        <div className="w-10 h-10 bg-white clip-path-hexagon animate-pulse shadow-[0_0_30px_white]" />
      </div>
    );

    // 70-79: CYBER CONSTRUCT (Tech)
    if (level < 80) return (
      <div className="relative flex items-center justify-center">
        <motion.div animate={{ scaleY: [1, 0.1, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-1 h-32 absolute bg-white/20" />
        <motion.div animate={{ scaleX: [1, 0.1, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 1 }} className="h-1 w-32 absolute bg-white/20" />
        <div className="w-16 h-16 border-4 rotate-45 flex items-center justify-center backdrop-blur-sm" style={{ borderColor: primaryColor, background: `${secondaryColor}30` }}>
        <div className="w-8 h-8 bg-white rotate-45" />
        </div>
      </div>
    );

    // 80-89: DIGITAL ENTITY (Complexo)
    if (level < 90) return (
      <div className="relative">
        {[0, 60, 120].map(deg => (
          <motion.div key={deg} animate={{ rotate: 360 }} transition={{ duration: 5, repeat: Infinity, ease: "linear" }} 
          className="absolute w-32 h-10 border border-white/30 rounded-full" style={{ rotate: deg, borderColor: primaryColor }} />
        ))}
        <div className="w-10 h-10 rounded-full blur-lg animate-pulse" style={{ background: 'white' }} />
      </div>
    );

    // 90+: SINGULARITY (Buraco Negro)
    return (
      <div className="relative flex items-center justify-center">
        <div className="w-24 h-24 bg-black rounded-full z-10 border-2" style={{ borderColor: 'white', boxShadow: `0 0 60px ${primaryColor}` }} />
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }} transition={{ duration: 1, repeat: Infinity }} 
          className="absolute w-32 h-32 rounded-full border-4 border-dashed" style={{ borderColor: primaryColor }} />
      </div>
    );
  };

  return (
    <div style={{ scale: sizeScale }} className="relative flex flex-col items-center justify-center">
      <div className="absolute inset-0 blur-[60px] opacity-20 pointer-events-none" style={{ background: primaryColor }} />
      
      {/* O Pet */}
      <div className="relative z-10 filter drop-shadow-2xl">
        {renderForm()}
      </div>

      {/* Info (Só mostra se for tamanho grande) */}
      {size === "lg" && (
        <div className="mt-8 text-center z-10">
          <h3 className="font-bold text-sm tracking-[0.3em] uppercase drop-shadow-md text-white/90">
            {isMegaRare ? "OMEGA SINGULARITY" : "SPIRIT FORM"}
          </h3>
          <div className="flex items-center justify-center gap-2 mt-2 text-[10px] text-zinc-400 font-mono">
            <span className="bg-white/10 px-2 py-0.5 rounded">LVL.{level}</span>
            <div className="h-1 w-16 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-white" style={{ width: `${xp}%` }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}