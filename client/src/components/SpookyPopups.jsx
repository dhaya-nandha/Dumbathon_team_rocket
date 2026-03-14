import { useState, useEffect } from 'react';

const splatEmojis = ['🩸', '🧠', '🦠', '💀', '🧟', '👁️', '🕷️', '☠️', '🫀', '🪱'];
const splatTexts = ['BEHIND YOU', 'PUS LEAK', 'INFECTION', 'TOXIC', 'BREACH', 'CORPSE ALERT'];

export default function SpookyPopups() {
  const [splats, setSplats] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const splat = {
        id: Date.now() + Math.random(),
        top: Math.random() * 90 + 5,
        left: Math.random() * 90 + 5,
        isEmoji: Math.random() > 0.3,
        content: Math.random() > 0.3
          ? splatEmojis[Math.floor(Math.random() * splatEmojis.length)]
          : splatTexts[Math.floor(Math.random() * splatTexts.length)],
        size: Math.random() * 30 + 20, // px
        rot: Math.random() * 60 - 30
      };
      setSplats(prev => [...prev, splat]);
      setTimeout(() => {
        setSplats(prev => prev.filter(s => s.id !== splat.id));
      }, 300 + Math.random() * 400);
    }, 4000 + Math.random() * 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {splats.map(s => (
        <div key={s.id}
             className="absolute animate-ping"
             style={{
               top: `${s.top}%`,
               left: `${s.left}%`,
               transform: `rotate(${s.rot}deg)`,
               fontSize: s.isEmoji ? `${s.size}px` : `${s.size * 0.5}px`,
               color: '#991B1B',
               textShadow: '0 0 8px rgba(153,27,27,0.8)',
               fontWeight: 900,
               letterSpacing: '0.1em',
               mixBlendMode: 'difference'
             }}>
          {s.content}
        </div>
      ))}
    </div>
  );
}
