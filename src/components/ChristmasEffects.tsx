import { useEffect, useState } from 'react';

const flakes = Array.from({ length: 25 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  delay: `${Math.random() * 10}s`,
  duration: `${8 + Math.random() * 12}s`,
  size: `${10 + Math.random() * 14}px`,
  opacity: 0.3 + Math.random() * 0.5,
}));

export function ChristmasEffects() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <style>{`
        @keyframes snowfall {
          0% { transform: translateY(-10vh) rotate(0deg); }
          100% { transform: translateY(110vh) rotate(360deg); }
        }
        @keyframes santaFloat {
          0%, 100% { transform: translateY(0px) rotate(-5deg); }
          50% { transform: translateY(-15px) rotate(5deg); }
        }
      `}</style>

      {/* Snowflakes */}
      <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden="true">
        {flakes.map((f) => (
          <span
            key={f.id}
            style={{
              position: 'absolute',
              top: '-5vh',
              left: f.left,
              fontSize: f.size,
              opacity: f.opacity,
              animation: `snowfall ${f.duration} linear ${f.delay} infinite`,
              color: '#fff',
              textShadow: '0 0 5px rgba(255,255,255,0.5)',
            }}
          >
            ❄
          </span>
        ))}
      </div>

      {/* Santa that moves with scroll */}
      <div
        className="pointer-events-none fixed right-4 z-50 text-5xl sm:text-6xl"
        style={{
          bottom: `${20 + (scrollY % 200) * 0.3}px`,
          animation: 'santaFloat 3s ease-in-out infinite',
          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
        }}
        aria-hidden="true"
      >
        🎅
      </div>
    </>
  );
}
