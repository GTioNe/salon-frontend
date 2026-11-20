import { useEffect, useState } from 'react';

// Flocos de neve caindo
const flakes = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  delay: `${Math.random() * 8}s`,
  duration: `${8 + Math.random() * 10}s`,
  size: `${10 + Math.random() * 12}px`,
  opacity: 0.2 + Math.random() * 0.5,
}));

export function ChristmasEffects() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const updateScroll = () => {
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;
      const maxScroll = Math.max(1, fullHeight - windowHeight);
      const current = window.scrollY;

      // Progresso de 0.0 a 1.0
      const progress = Math.min(1, Math.max(0, current / maxScroll));
      setScrollProgress(progress);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateScroll, { passive: true });
    updateScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', updateScroll);
    };
  }, []);

  return (
    <>
      <style>{`
        @keyframes snowfall {
          0% { transform: translateY(-10vh) rotate(0deg); }
          100% { transform: translateY(110vh) rotate(360deg); }
        }
      `}</style>

      {/* Flocos de Neve Caindo */}
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

      {/* Corda Vertical na Borda Direita (Tiled Repeat-Y) */}
      <div
        className="pointer-events-none fixed z-50"
        style={{
          top: 0,
          bottom: 0,
          right: '6px',
          width: '16px',
          backgroundImage: "url('/icons/Gemini_Generated_Image_8q0wd08q0wd08q0w.jpg')",
          backgroundRepeat: 'repeat-y',
          backgroundPosition: 'center top',
          backgroundSize: '8px auto',
          opacity: 0.85,
        }}
        aria-hidden="true"
      />

      {/* Papai Noel Descendo/Subindo na Corda conforme Scroll */}
      <div
        className="pointer-events-none fixed z-50 transition-transform duration-75 ease-out"
        style={{
          right: '-2px',
          top: `${15 + scrollProgress * 70}vh`,
          width: '56px',
          height: '70px',
        }}
        aria-hidden="true"
      >
        <img
          src="/icons/Gemini_Generated_Image_8q0wd08q0wd08q0w (1).jpg"
          alt="Papai Noel na Corda"
          className="w-full h-full object-contain filter drop-shadow(0 4px 6px rgba(0,0,0,0.5))"
        />
      </div>
    </>
  );
}
