import React, { useMemo } from 'react';

export interface TableProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  type?: 'coffee' | 'desk' | 'dining';
  material?: 'wood' | 'glass' | 'metal';
  color?: string;
}

export const Table: React.FC<TableProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  type = 'coffee',
  material = 'wood',
  color
}) => {
  const tableDimensions = useMemo(() => {
    switch (type) {
      case 'coffee':
        return {
          width: 1.2,
          height: 0.35,
          depth: 0.6,
          legHeight: 0.25,
          legSize: 0.05,
          legOffset: 0.45
        };
      case 'desk':
        return {
          width: 0.8,
          height: 0.65,
          depth: 0.5,
          legHeight: 0.55,
          legSize: 0.06,
          legOffset: 0.32
        };
      case 'dining':
        return {
          width: 1.8,
          height: 0.75,
          depth: 0.9,
          legHeight: 0.65,
          legSize: 0.08,
          legOffset: 0.8
        };
      default:
        return {
          width: 1.2,
          height: 0.35,
          depth: 0.6,
          legHeight: 0.25,
          legSize: 0.05,
          legOffset: 0.45
        };
    }
  }, [type]);

  const tableProperties = useMemo(() => {
    const materialDefaults = {
      wood: { color: color || '#8b4513', roughness: 0.8, metalness: 0 },
      glass: {
        color: color || '#aaddff',
        roughness: 0.1,
        metalness: 0,
        transparent: true,
        opacity: 0.5
      },
      metal: { color: color || '#555555', roughness: 0.3, metalness: 0.8 }
    };

    return {
      ...materialDefaults[material],
      color: materialDefaults[material].color
    };
  }, [material, color]);

  const { width, height, depth, legHeight, legSize, legOffset } = tableDimensions;

  const TableTop: React.FC = () => (
    <mesh position={[0, height, 0]}>
      <boxGeometry args={[width, 0.05, depth]} />
      <meshStandardMaterial {...tableProperties} />
    </mesh>
  );

  const Leg: React.FC<{ x: number; z: number }> = ({ x, z }) => (
    <mesh position={[x, legHeight / 2, z]}>
      <boxGeometry args={[legSize, legHeight, legSize]} />
      <meshStandardMaterial {...tableProperties} />
    </mesh>
  );

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <TableTop />

      {/* Legs */}
      <Leg x={-legOffset} z={-legOffset} />
      <Leg x={legOffset} z={-legOffset} />
      <Leg x={-legOffset} z={legOffset} />
      <Leg x={legOffset} z={legOffset} />
    </group>
  );
};
