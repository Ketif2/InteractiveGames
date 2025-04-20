import React, { forwardRef } from 'react';

const ForestPath = forwardRef(({ pathString, pathWidth = 40, className = "" }, ref) => {
  return (
    <svg 
      width="100%" 
      height="100%" 
      className={`absolute inset-0 ${className}`}
      ref={ref}
    >
      <defs>
        <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#d4a76a" />
          <stop offset="100%" stopColor="#cc8e35" />
        </linearGradient>
      </defs>
      <path 
        d={pathString} 
        fill="none" 
        stroke="url(#pathGradient)" 
        strokeWidth={pathWidth || 40} 
        strokeLinecap="round"
        filter="drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))"
      />
    </svg>
  );
});

ForestPath.displayName = 'ForestPath';

export default ForestPath;