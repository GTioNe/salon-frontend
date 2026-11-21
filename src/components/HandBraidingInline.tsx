"use client";

import { useEffect, useRef } from "react";

interface HandBraidingInlineProps {
  width?: number;
  height?: number;
  hairColor?: string;
  hairHighlight?: string;
  skinColor?: string;
  skinShadow?: string;
}

export default function HandBraidingInline({
  width = 48,
  height = 72,
  hairColor = "#9333ea",
  hairHighlight = "#d8b4fe",
  skinColor = "#d69467",
  skinShadow = "#b37247",
}: HandBraidingInlineProps) {
  const handRef = useRef<SVGGElement | null>(null);
  const indexFingerRef = useRef<SVGPathElement | null>(null);
  const middleFingerRef = useRef<SVGPathElement | null>(null);
  const lowerBraidRef = useRef<SVGGElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let animationFrameId = 0;
    let phase = 0;
    let lastTime = window.performance.now();

    const animate = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      // Ritmo contínuo de quem está trançando
      phase += dt * 3.8;

      const s1 = Math.sin(phase);
      const s2 = Math.cos(phase);

      // Mão com movimento sutil para frente/trás e leve inclinação
      if (handRef.current) {
        handRef.current.style.transform = `translate(${s1 * 2.5}px, ${s2 * 2}px) rotate(${s1 * 3.5}deg)`;
      }

      // Dedos alternando o movimento de entrelaçar
      if (indexFingerRef.current) {
        indexFingerRef.current.style.transform = `translate(${s1 * 2}px, ${s2 * 1.5}px)`;
      }
      if (middleFingerRef.current) {
        middleFingerRef.current.style.transform = `translate(${-s1 * 2}px, ${-s2 * 1.5}px)`;
      }

      // Trança ganhando um leve balanço vivo
      if (lowerBraidRef.current) {
        lowerBraidRef.current.style.transform = `rotate(${-s1 * 2}deg)`;
      }

      animationFrameId = window.requestAnimationFrame(animate);
    };

    animationFrameId = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <span
      aria-hidden="true"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        filter: "drop-shadow(0 3px 6px rgba(0, 0, 0, 0.45))",
      }}
    >
      <svg
        viewBox="0 0 90 120"
        width={width}
        height={height}
        style={{ overflow: "visible" }}
      >
        {/* Mecha solta entrando por cima */}
        <path
          d="M34 8 C31 18, 36 26, 34 36"
          stroke={hairColor}
          strokeWidth="6.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M42 10 C45 20, 39 28, 42 38"
          stroke={hairHighlight}
          strokeWidth="4.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Corpo da trança com gomos orgânicos */}
        <g
          ref={lowerBraidRef}
          style={{ transformBox: "fill-box", transformOrigin: "top center" }}
        >
          {/* Base interna escura para dar profundidade */}
          <path
            d="M38 36 L38 108"
            stroke="#1c1917"
            strokeWidth="12"
            strokeLinecap="round"
          />

          {/* Gomos / nós da trança */}
          <ellipse cx="38" cy="44" rx="8" ry="4.5" fill={hairColor} />
          <ellipse cx="38" cy="43.5" rx="4.5" ry="2.2" fill={hairHighlight} />

          <ellipse cx="38" cy="55" rx="8.5" ry="4.8" fill={hairHighlight} />
          <ellipse cx="38" cy="55.5" rx="4.5" ry="2.2" fill={hairColor} />

          <ellipse cx="38" cy="66" rx="8.5" ry="4.8" fill={hairColor} />
          <ellipse cx="38" cy="65.5" rx="4.5" ry="2.2" fill={hairHighlight} />

          <ellipse cx="38" cy="77" rx="8" ry="4.5" fill={hairHighlight} />
          <ellipse cx="38" cy="77.5" rx="4.2" ry="2" fill={hairColor} />

          <ellipse cx="38" cy="88" rx="7.2" ry="4.2" fill={hairColor} />
          <ellipse cx="38" cy="87.5" rx="3.8" ry="1.8" fill={hairHighlight} />

          {/* Ponta afinando */}
          <path
            d="M32 92 Q38 112 38 114 Q38 112 44 92 Z"
            fill={hairColor}
          />
        </g>

        {/* Mão desenhada com traço contínuo e dedos curvados */}
        <g
          ref={handRef}
          style={{ transformBox: "fill-box", transformOrigin: "62% 55%" }}
        >
          {/* Antebraço / punho saindo da lateral */}
          <path
            d="M84 58 C74 56, 66 52, 58 50 L55 66 C64 68, 74 71, 84 72 Z"
            fill={skinShadow}
          />

          {/* Palma arredondada */}
          <path
            d="M60 47 C52 44, 44 47, 42 54 C40 61, 46 68, 55 68 C61 68, 65 63, 65 57 C65 52, 63 49, 60 47 Z"
            fill={skinColor}
          />

          {/* Dedo indicador curvado sobre a mecha */}
          <path
            ref={indexFingerRef}
            d="M48 47 C41 45, 35 47, 33 51 C32 53, 35 55, 39 54 C43 53, 47 52, 50 52 Z"
            fill={skinColor}
            stroke={skinShadow}
            strokeWidth="0.8"
            style={{ transformBox: "fill-box", transformOrigin: "right center" }}
          />

          {/* Dedo médio logo abaixo */}
          <path
            ref={middleFingerRef}
            d="M47 54 C40 53, 34 55, 33 59 C33 61, 36 62, 40 61 C44 60, 47 59, 50 59 Z"
            fill={skinShadow}
            style={{ transformBox: "fill-box", transformOrigin: "right center" }}
          />

          {/* Dedo anelar / mindinho apoiando por baixo */}
          <path
            d="M48 61 C42 61, 37 63, 36 66 C36 68, 39 69, 43 68 C46 67, 49 66, 51 65 Z"
            fill={skinColor}
          />
        </g>
      </svg>
    </span>
  );
}