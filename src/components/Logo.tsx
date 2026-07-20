import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export function Logo({ className = '', size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block ${className}`}
    >
      <defs>
        <linearGradient id="bronzeGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A27D5C" />
          <stop offset="25%" stopColor="#D4B08C" />
          <stop offset="50%" stopColor="#735235" />
          <stop offset="75%" stopColor="#B38D6A" />
          <stop offset="100%" stopColor="#4A311D" />
        </linearGradient>
        
        <linearGradient id="bronzeGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5E3F26" />
          <stop offset="50%" stopColor="#C49F7A" />
          <stop offset="100%" stopColor="#3D2615" />
        </linearGradient>

        <filter id="dropShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Outer thick frame */}
      <circle
        cx="50"
        cy="50"
        r="47"
        stroke="url(#bronzeGradient1)"
        strokeWidth="4"
        filter="url(#dropShadow)"
      />
      
      {/* Middle accent ring */}
      <circle
        cx="50"
        cy="50"
        r="42"
        stroke="url(#bronzeGradient2)"
        strokeWidth="2"
      />

      {/* Inner thin ring */}
      <circle
        cx="50"
        cy="50"
        r="38"
        stroke="url(#bronzeGradient1)"
        strokeWidth="1.5"
      />

      {/* Monogram 'LH' in serif */}
      <text
        x="50"
        y="67"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="44"
        fontWeight="400"
        fill="url(#bronzeGradient2)"
        textAnchor="middle"
        letterSpacing="2"
        filter="url(#dropShadow)"
      >
        LH
      </text>
    </svg>
  );
}

