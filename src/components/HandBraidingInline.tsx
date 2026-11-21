import { useEffect, useRef } from 'react';

interface HandBraidingInlineProps {
  width?: number;
  height?: number;
}

export default function HandBraidingInline({
  width = 44,
  height = 58,
}: HandBraidingInlineProps) {
  const strandLeftRef = useRef<SVGPathElement | null>(null);
  const strandRightRef = useRef<SVGPathElement | null>(null);
  const fingerTopRef = useRef<SVGGElement | null>(null);
  const fingerBottomRef = useRef<SVGGElement | null>(null);

  useEffect(() => {
    let animationFrameId = 0;
    let phase = 0;
    let lastTime = performance.now();

    const animate = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      phase += dt * 4.5;

      const wave = Math.sin(phase);
      const cross = Math.cos(phase);

      if (fingerTopRef.current) {
        fingerTopRef.current.style.transform = `translate(${wave * 3}px, ${cross * 2.5}px) rotate(${wave * 8}deg)`;
      }
      if (fingerBottomRef.current) {
        fingerBottomRef.current.style.transform = `translate(${-wave * 3}px, ${-cross * 2.5}px) rotate(${-wave * 8}deg)`;
      }
      if (strandLeftRef.current) {
        strandLeftRef.current.style.transform = `translateX(${wave * 5}px)`;
      }
      if (strandRightRef.current) {
        strandRightRef.current.style.transform = `translateX(${-wave * 5}px)`;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <span
      aria-hidden="true"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        filter: 'drop-shadow(0 3px 6px rgba(0, 0, 0, 0.45))',
      }}
    >
      <svg
        viewBox="0 0 80 110"
        width={width}
        height={height}
        style={{ overflow: 'visible' }}
      >
        {/* Mecha principal e trança central */}
        <path
          d="M40 12 C34 26, 46 38, 40 52 C34 66, 46 78, 40 94"
          stroke="#7e22ce"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M40 14 C35 27, 45 39, 40 53 C35 67, 45 79, 40 92"
          stroke="#c084fc"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />

        {/* Mecha esquerda cruzando */}
        <path
          ref={strandLeftRef}
          d="M24 34 Q35 44 45 54"
          stroke="#9333ea"
          strokeWidth="4.5"
          strokeLinecap="round"
          fill="none"
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        />

        {/* Mecha direita cruzando */}
        <path
          ref={strandRightRef}
          d="M56 38 Q45 48 35 58"
          stroke="#a855f7"
          strokeWidth="4.5"
          strokeLinecap="round"
          fill="none"
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        />

        {/* Palma e punho */}
        <ellipse cx="42" cy="48" rx="11" ry="13" fill="#d99b72" />
        <rect x="36" y="58" width="12" height="14" rx="5" fill="#c4865e" />

        {/* Dedos superiores trançando */}
        <g
          ref={fingerTopRef}
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        >
          <rect x="31" y="34" width="6" height="13" rx="3" fill="#e3a880" />
          <rect x="38" y="32" width="6" height="14" rx="3" fill="#d99b72" />
          <rect x="45" y="35" width="6" height="13" rx="3" fill="#c98b63" />
        </g>

        {/* Dedos inferiores ajustando a mecha */}
        <g
          ref={fingerBottomRef}
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        >
          <rect x="33" y="48" width="6" height="11" rx="3" fill="#cf9068" />
          <rect x="41" y="49" width="6" height="11" rx="3" fill="#c4865e" />
        </g>
      </svg>
    </span>
  );
}
