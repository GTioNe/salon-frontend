import { useEffect, useRef } from 'react';

const flakes = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  delay: `${Math.random() * 8}s`,
  duration: `${8 + Math.random() * 10}s`,
  size: `${10 + Math.random() * 12}px`,
  opacity: 0.2 + Math.random() * 0.5,
}));

export function ChristmasEffects() {
  const santaRef = useRef<HTMLDivElement>(null);
  const armLeftRef = useRef<SVGGElement>(null);
  const armRightRef = useRef<SVGGElement>(null);
  const legLeftRef = useRef<SVGGElement>(null);
  const legRightRef = useRef<SVGGElement>(null);

  useEffect(() => {
    let raf = 0;
    let currentY = 20;
    let lastScrollY = window.scrollY;
    let climbPhase = 0;

    const loop = () => {
      const scrollY = window.scrollY;
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      const progress = Math.min(1, Math.max(0, scrollY / maxScroll));

      const minTop = 40;
      const maxTop = window.innerHeight - 120;
      const targetY = minTop + progress * (maxTop - minTop);

      // Suavização (inércia leve)
      currentY += (targetY - currentY) * 0.12;

      // Ciclo de escalada baseado na distância percorrida
      climbPhase += (scrollY - lastScrollY) * 0.04;
      lastScrollY = scrollY;

      const swing = Math.sin(climbPhase);
      const bodyTilt = Math.cos(climbPhase) * 3;

      if (armLeftRef.current) {
        armLeftRef.current.style.transform = `translateY(${swing * 6}px) rotate(${swing * 12}deg)`;
      }
      if (armRightRef.current) {
        armRightRef.current.style.transform = `translateY(${-swing * 6}px) rotate(${-swing * 12}deg)`;
      }
      if (legLeftRef.current) {
        legLeftRef.current.style.transform = `translateY(${-swing * 5}px) rotate(${-swing * 15}deg)`;
      }
      if (legRightRef.current) {
        legRightRef.current.style.transform = `translateY(${swing * 5}px) rotate(${swing * 15}deg)`;
      }
      if (santaRef.current) {
        santaRef.current.style.transform = `translate3d(0, ${currentY}px, 0) rotate(${bodyTilt}deg)`;
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      <style>{`
        @keyframes snowfall {
          0% { transform: translateY(-10vh) rotate(0deg); }
          100% { transform: translateY(110vh) rotate(360deg); }
        }
        .santa-limb {
          transform-box: fill-box;
        }
        #santa-arm-left, #santa-arm-right { transform-origin: bottom center; }
        #santa-leg-left, #santa-leg-right { transform-origin: top center; }
      `}</style>

      {/* Flocos de Neve Caindo */}
      <div
        className="pointer-events-none fixed inset-0 z-40 overflow-hidden"
        aria-hidden="true"
      >
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

      {/* Corda Vertical na Borda Direita */}
      <div
        className="pointer-events-none fixed z-50"
        style={{
          top: 0,
          bottom: 0,
          right: '20px',
          width: '16px',
          backgroundImage:
            "url('/icons/Gemini_Generated_Image_8q0wd08q0wd08q0w.png')",
          backgroundRepeat: 'repeat-y',
          backgroundPosition: 'center top',
          backgroundSize: '8px auto',
          opacity: 0.85,
        }}
        aria-hidden="true"
      />

      {/* Papai Noel Articulado na Corda */}
      <div
        ref={santaRef}
        className="pointer-events-none fixed z-50 will-change-transform"
        style={{
          top: 0,
          right: '6px',
          width: '56px',
          height: '70px',
          transform: 'translate3d(0, 20px, 0)',
          filter: 'drop-shadow(0 6px 8px rgba(0,0,0,0.5))',
        }}
        aria-hidden="true"
      >
        <svg viewBox="0 0 80 110" width="54" height="74">
          {/* Saco de presentes nas costas */}
          <circle cx="24" cy="56" r="14" fill="#8B4513" />
          <path
            d="M18 44 Q24 38 30 44"
            stroke="#D4AF37"
            strokeWidth="2"
            fill="none"
          />

          {/* Perna Esquerda */}
          <g id="santa-leg-left" ref={legLeftRef} className="santa-limb">
            <rect x="34" y="68" width="9" height="22" rx="4" fill="#B22222" />
            <rect x="33" y="86" width="12" height="7" rx="3" fill="#1a1a1a" />
          </g>

          {/* Perna Direita */}
          <g id="santa-leg-right" ref={legRightRef} className="santa-limb">
            <rect x="44" y="68" width="9" height="22" rx="4" fill="#D32F2F" />
            <rect x="44" y="86" width="12" height="7" rx="3" fill="#1a1a1a" />
          </g>

          {/* Tronco */}
          <rect x="31" y="38" width="24" height="34" rx="10" fill="#D32F2F" />
          {/* Cinto */}
          <rect x="31" y="56" width="24" height="5" fill="#1a1a1a" />
          <rect
            x="42"
            y="55"
            width="7"
            height="7"
            rx="1"
            stroke="#FFD700"
            strokeWidth="1.5"
            fill="none"
          />

          {/* Braço Esquerdo (alcançando a corda) */}
          <g id="santa-arm-left" ref={armLeftRef} className="santa-limb">
            <rect x="42" y="24" width="8" height="22" rx="4" fill="#B22222" />
            <circle cx="46" cy="23" r="4.5" fill="#FFFFFF" />
          </g>

          {/* Cabeça e Barba */}
          <circle cx="43" cy="30" r="9" fill="#FFCCBC" />
          <path d="M35 31 Q43 44 51 31 Z" fill="#FFFFFF" />

          {/* Gorro */}
          <path d="M34 26 Q43 12 52 26 Z" fill="#D32F2F" />
          <rect x="33" y="24" width="20" height="4" rx="2" fill="#FFFFFF" />
          <circle cx="32" cy="18" r="3.5" fill="#FFFFFF" />

          {/* Braço Direito (puxando a corda) */}
          <g id="santa-arm-right" ref={armRightRef} className="santa-limb">
            <rect x="44" y="34" width="8" height="22" rx="4" fill="#D32F2F" />
            <circle cx="48" cy="33" r="4.5" fill="#FFFFFF" />
          </g>
        </svg>
      </div>
    </>
  );
}
