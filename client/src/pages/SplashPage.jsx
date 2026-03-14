import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SplashPage() {
  const [blasted, setBlasted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (blasted) {
      const timer = setTimeout(() => {
        navigate('/login');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [blasted, navigate]);

  return (
    <div className={`relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center transition-colors duration-1000 ${blasted ? 'bg-fungus-purple' : 'bg-night'}`}>
      
      {/* Background Decorative Elements */}
      <div className="pointer-events-none absolute inset-0 opacity-20">
        {!blasted && (
          <div className="absolute top-10 left-10 w-32 h-32 bg-pus-green rounded-full blur-3xl animate-pulse-fast"></div>
        )}
        {blasted && (
          <>
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-radium-yellow rounded-full blur-[100px] animate-flicker"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blood-red rounded-full blur-[100px] animate-pus-blast"></div>
          </>
        )}
      </div>

      {!blasted ? (
        <div className="z-10 text-center flex flex-col items-center max-w-4xl px-4">
          <div className="relative group cursor-pointer" onClick={() => setBlasted(true)}>
            <div className="absolute -inset-1 bg-gradient-to-r from-blood-red to-pus-green rounded-xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <img 
              src="/zombie_college_splash.png" 
              alt="Zombie approaching college" 
              className="relative w-full rounded-xl shadow-blood border border-blood-red transform transition group-hover:scale-105"
            />
            
            {/* Overlay Instructions */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
               <h2 className="text-3xl md:text-5xl font-black text-white px-6 py-3 bg-night/80 border-4 border-pus-green rounded-md shadow-pus animate-pulse-fast uppercase tracking-widest">
                  Click to Breach
               </h2>
            </div>
          </div>
          <p className="mt-8 text-zombie-skin font-bold tracking-widest uppercase opacity-70">
            System Defense: Optimal. Perimeter: Secure.
          </p>
        </div>
      ) : (
        <div className="z-20 text-center animate-pus-blast flex flex-col items-center">
            <h1 className="text-7xl md:text-[9rem] font-black italic tracking-tighter text-radium-yellow text-glow-radium drop-shadow-[0_0_35px_rgba(217,249,157,0.8)] mix-blend-screen scale-y-110">
              NEURO-TOXIN
            </h1>
            <h2 className="text-2xl md:text-4xl font-bold mt-4 text-pus-green uppercase tracking-[0.5em] animate-flicker-slow shadow-pus p-2 bg-black/40">
              The VIT-AP Zombie Exchange
            </h2>
            <div className="mt-12 h-2 w-64 bg-night relative overflow-hidden rounded-full border border-radium-yellow">
                <div className="absolute top-0 left-0 h-full bg-pus-green transition-all duration-[3000ms] w-full origin-left scale-x-0 animate-[fillBar_3s_ease-out_forwards]"></div>
            </div>
            <style>{`
              @keyframes fillBar {
                to { transform: scaleX(1); }
              }
            `}</style>
        </div>
      )}
    </div>
  );
}
