import React from 'react';

export interface FurnitureComponentProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  children: React.ReactNode;
}

export const FurnitureComponent: React.FC<FurnitureComponentProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  children
}) => {
  return (
    <group
      position={position}
      rotation={rotation}
      scale={scale}
    >
      {children}
    </group>
  );
};
