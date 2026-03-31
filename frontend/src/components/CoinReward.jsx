import React, { useState, useEffect } from 'react';
import { Coins as CoinIcon, Star, Zap } from 'lucide-react';
import chestImg from '../assets/treasure_chest.png';

const CoinReward = ({ amount = 50 }) => {
  const [phase, setPhase] = useState('idle');
  const [particles, setParticles] = useState([]);
  const [starParticles, setStarParticles] = useState([]);
  const [rings, setRings] = useState([]);

  // Auto-fires on mount. Dashboard remounts this via key={rewardKey} each time a node is completed.
  useEffect(() => {
    // Phase 1: Show chest pop
    setPhase('chest');

    // Phase 2: Burst particles
    setTimeout(() => {
      setPhase('burst');

      // 16 coin burst radially
      const coins = [];
      for (let i = 0; i < 16; i++) {
        const angle = (Math.PI * 2 * i) / 16;
        const speed = 130 + Math.random() * 90;
        coins.push({
          id: i,
          dx: Math.cos(angle) * speed,
          dy: Math.sin(angle) * speed - 60,
          delay: Math.random() * 0.15,
          size: 20 + Math.random() * 14,
        });
      }
      setParticles(coins);

      // 12 star sparkles
      const stars = [];
      for (let i = 0; i < 12; i++) {
        const angle = (Math.PI * 2 * i) / 12 + Math.PI / 12;
        const speed = 80 + Math.random() * 120;
        stars.push({
          id: i,
          dx: Math.cos(angle) * speed,
          dy: Math.sin(angle) * speed,
          delay: Math.random() * 0.2 + 0.1,
          size: 10 + Math.random() * 10,
        });
      }
      setStarParticles(stars);

      // 3 shimmer rings
      setRings([{ id: 1, delay: 0 }, { id: 2, delay: 0.2 }, { id: 3, delay: 0.4 }]);
    }, 600);

    // Phase 3: Show reward text
    setTimeout(() => setPhase('text'), 900);

    // Phase 4: Clean up
    setTimeout(() => {
      setPhase('idle');
      setParticles([]);
      setStarParticles([]);
      setRings([]);
    }, 2800);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (phase === 'idle') return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center pointer-events-none">
      {/* Dim overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Shimmer rings */}
      {rings.map(ring => (
        <div
          key={ring.id}
          className="shimmer-ring absolute rounded-full border-4 border-amber-400/60"
          style={{ width: 180, height: 180, animationDelay: `${ring.delay}s` }}
        />
      ))}

      {/* Coin particles */}
      {particles.map(p => (
        <div
          key={p.id}
          className="coin-particle"
          style={{
            '--dx': `${p.dx}px`,
            '--dy': `${p.dy}px`,
            animation: `coin-burst 1.2s ${p.delay}s cubic-bezier(0.25, 0.46, 0.45, 0.94) both`,
          }}
        >
          <CoinIcon size={p.size} fill="#fbbf24" stroke="#d97706" />
        </div>
      ))}

      {/* Star sparkles */}
      {starParticles.map(p => (
        <div
          key={p.id}
          className="coin-particle"
          style={{
            '--dx': `${p.dx}px`,
            '--dy': `${p.dy}px`,
            color: '#f472b6',
            filter: 'drop-shadow(0 0 8px rgba(244, 114, 182, 0.9))',
            animation: `coin-burst 1s ${p.delay}s ease-out both`,
          }}
        >
          <Star size={p.size} fill="currentColor" stroke="none" />
        </div>
      ))}

      {/* Treasure Chest */}
      {(phase === 'chest' || phase === 'burst' || phase === 'text') && (
        <div className="relative animate-chest-pop">
          <div className="absolute inset-0 rounded-full bg-amber-400/30 blur-3xl scale-150" />
          <img
            src={chestImg}
            alt="Treasure Chest"
            className="w-56 h-56 object-contain relative z-10"
            style={{ filter: 'drop-shadow(0 0 40px rgba(245,158,11,0.8)) drop-shadow(0 0 80px rgba(251,191,36,0.4))' }}
          />
          <Zap size={28} className="absolute -top-4 -right-2 text-amber-300 animate-ping" fill="#fcd34d" />
          <Zap size={20} className="absolute -top-2 -left-4 text-yellow-300 animate-ping" fill="#fde68a" style={{ animationDelay: '0.15s' }} />
        </div>
      )}

      {/* Reward text */}
      {phase === 'text' && (
        <div className="absolute top-[58%] flex flex-col items-center gap-3 animate-reward-text">
          <h2
            className="text-5xl font-black uppercase tracking-tighter italic"
            style={{
              background: 'linear-gradient(135deg, #fbbf24, #f59e0b, #ef4444)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 20px rgba(245,158,11,0.6))',
            }}
          >
            NODE COMPLETE!
          </h2>
          <div className="flex items-center gap-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-3 rounded-full font-black text-lg shadow-[0_0_30px_rgba(245,158,11,0.6)] border border-amber-400/50">
            <CoinIcon size={22} fill="currentColor" />
            <span>+{amount} COINS EARNED</span>
            <Star size={18} fill="white" />
          </div>
        </div>
      )}
    </div>
  );
};

export default CoinReward;
