import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
  color?: string;
}

// Clean Cat Silhouette Icon
export function CatSilhouette({ size = 24, className = '', color = 'currentColor' }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill={color}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Left ear */}
      <path d="M18 18 L28 6 L24 26 Z" />
      {/* Right ear */}
      <path d="M46 18 L36 6 L40 26 Z" />
    </svg>
  );
}

// Clean Paw Icon
export function PawIcon({ size = 24, className = '', color = 'currentColor' }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill={color}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Large pad */}
      <ellipse cx="32" cy="44" rx="14" ry="10" />
      {/* Toes */}
      <ellipse cx="20" cy="28" rx="6" ry="8" />
      <ellipse cx="32" cy="20" rx="6" ry="8" />
      <ellipse cx="44" cy="28" rx="6" ry="8" />
    </svg>
  );
}


