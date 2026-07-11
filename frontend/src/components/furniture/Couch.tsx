import React, { useMemo } from 'react';


export interface CouchProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  size?: '2-seater' | '3-seater' | 'sectional';
  color?: string;
}

export const Couch: React.FC<CouchProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  size = '3-seater',
  color = '#4a4a4a'
}) => {
  const couchDimensions = useMemo(() => {
    switch (size) {
      case '2-seater':
        return {
          width: 1.5,
          height: 0.4,
          depth: 0.8,
          cushionWidth: 0.6,
          cushionDepth: 0.65
        };
      case 'sectional':
        return {
          width: 2.2,
          height: 0.4,
          depth: 1.2,
          cushionWidth: 0.5,
          cushionDepth: 0.65
        };
      default: // '3-seater'
        return {
          width: 2,
          height: 0.4,
          depth: 0.8,
          cushionWidth: 0.65,
          cushionDepth: 0.65
        };
    }
  }, [size]);

  const { width, height, depth, cushionWidth, cushionDepth } = couchDimensions;

  const SofaFrame: React.FC = () => (
    <mesh position={[0, height / 2, 0]}>
      <boxGeometry args={[width, height, depth]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );

  const Cushion: React.FC<{ x: number; y: number; z: number }> = ({ x, y, z }) => (
    <mesh position={[x, y + 0.05, z]}>
      <boxGeometry args={[cushionWidth * 0.9, 0.1, cushionDepth * 0.9]} />
      <meshStandardMaterial color="#f0f0f0" />
    </mesh>
  );

  const Armrest: React.FC<{ side: 'left' | 'right' }> = ({ side }) => (
    <mesh
      position={[
        side === 'left' ? -width / 2 - 0.1 : width / 2 + 0.1,
        height / 2 + 0.1,
        0
      ]}
    >
      <boxGeometry args={[0.2, height + 0.2, depth]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );

  return (
    <group position={position} rotation={rotation}>
      <SofaFrame />

      {/* Left armrest */}
      <Armrest side="left" />

      {/* Right armrest */}
      <Armrest side="right" />

      {/* Back cushions */}
      <Cushion x={-width / 2 + cushionWidth / 2} y={height / 2} z={-depth / 2 - cushionDepth / 2} />
      <Cushion x={0} y={height / 2} z={-depth / 2 - cushionDepth / 2} />
      <Cushion x={width / 2 - cushionWidth / 2} y={height / 2} z={-depth / 2 - cushionDepth / 2} />

      {/* Seat cushions */}
      <Cushion x={-width / 2 + cushionWidth / 2} y={0} z={0} />
      <Cushion x={0} y={0} z={0} />
      <Cushion x={width / 2 - cushionWidth / 2} y={0} z={0} />
    </group>
  );
};
