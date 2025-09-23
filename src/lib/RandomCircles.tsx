"use client";

import { CSSProperties, FC, useMemo, useState, useEffect } from "react";

export type RandomCirclesProps = {
  count?: number;
  minSize?: number;
  maxSize?: number;
  color?: string;
  opacity?: number;
  transitionMs?: number;
  className?: string;
  isHovered?: boolean;
};

const RandomCircles: FC<RandomCirclesProps> = ({
  count = 8,
  minSize = 20,
  maxSize = 80,
  color = "#ffffff",
  opacity = 0.8,
  transitionMs = 650,
  className,
  isHovered = false,
}) => {
  const [circles, setCircles] = useState<Array<{id: number, size: number, x: number, y: number}>>([]);

  // Generate random positions on client side to avoid hydration issues
  useEffect(() => {
    const fixedSize = (minSize + maxSize) / 2; // Use average size for all circles
    const dotRadius = fixedSize / 2; // Radius of each dot
    const marginPx = 20; // 20px margin from border
    const totalMarginPx = marginPx + dotRadius; // Total margin including dot radius
    
    // Use a more conservative margin percentage to ensure proper spacing
    const marginPercent = 6; // Increased margin percentage to ensure 20px + radius spacing
    
    const newCircles = Array.from({ length: count }, (_, i) => {
      // Use true random positions for each page load
      const x = marginPercent + Math.random() * (100 - 2 * marginPercent);
      const y = marginPercent + Math.random() * (100 - 2 * marginPercent);
      
      return {
        id: i,
        size: fixedSize,
        x,
        y,
      };
    });
    
    setCircles(newCircles);
  }, [count, minSize, maxSize]);

  // Calculate diagonal alignment positions on hover
  const diagonalPositions = useMemo(() => {
    const positions = [];
    const marginPercent = 6; // Conservative margin percentage to ensure 20px + radius spacing
    const centerX = 50; // Center of container
    const centerY = 50; // Center of container
    const dotRadius = 40; // Radius of each dot (half of 80px diameter)
    const spacing = 0; // 0px spacing between dot edges
    
    // Calculate the distance between dot centers (radius + spacing + radius)
    const centerToCenterDistance = (dotRadius * 2) + spacing;
    
    // Calculate total diagonal length needed for all dots
    const totalDiagonalLength = (count - 1) * centerToCenterDistance;
    
    // Convert to percentage (assuming container is roughly 1000px wide)
    const diagonalLengthPercent = (totalDiagonalLength / 1000) * 100;
    
    for (let i = 0; i < count; i++) {
      // Distribute dots along diagonal with proper center-to-center spacing
      const progress = i / (count - 1); // 0 to 1
      const offset = (progress - 0.5) * diagonalLengthPercent;
      
      // Diagonal from top-right to bottom-left
      const x = centerX + offset;
      const y = centerY - offset;
      
      positions.push({ x, y });
    }
    
    return positions;
  }, [count]);

  return (
    <div
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
      }}
    >
      {circles.length > 0 && circles.map((circle, index) => {
        const targetPosition = isHovered ? diagonalPositions[index] : circle;
        
        const style: CSSProperties = {
          position: "absolute",
          left: `${targetPosition.x}%`,
          top: `${targetPosition.y}%`,
          transform: "translate(-50%, -50%)",
          width: `${circle.size}px`,
          height: `${circle.size}px`,
          borderRadius: "50%",
          backgroundColor: color,
          opacity: opacity.toString(),
          transition: `left ${transitionMs}ms ease, top ${transitionMs}ms ease`,
        };

        return <div key={circle.id} style={style} />;
      })}
    </div>
  );
};

export default RandomCircles;
