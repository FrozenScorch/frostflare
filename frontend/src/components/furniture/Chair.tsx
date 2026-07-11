import React from 'react';


export interface ChairProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  type?: 'office' | 'dining' | 'gaming';
  color?: string;
}

export const Chair: React.FC<ChairProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  type = 'office',
  color = '#2a2a2a'
}) => {
  const materialProps = {
    color: color,
    roughness: 0.4,
    metalness: 0.3
  };

  return (
    <group position={position} rotation={rotation}>
      {/* Chair Base - at height 0.4 */}
      <group position={[0, 0.4, 0]}>
        {/* Office chair wheels */}
        {type === 'office' && (
          <>
            <mesh position={[-0.3, 0, -0.3]}>
              <cylinderGeometry args={[0.08, 0.08, 0.05, 8]} />
              <meshStandardMaterial {...materialProps} />
            </mesh>
            <mesh position={[0.3, 0, -0.3]}>
              <cylinderGeometry args={[0.08, 0.08, 0.05, 8]} />
              <meshStandardMaterial {...materialProps} />
            </mesh>
            <mesh position={[-0.3, 0, 0.3]}>
              <cylinderGeometry args={[0.08, 0.08, 0.05, 8]} />
              <meshStandardMaterial {...materialProps} />
            </mesh>
            <mesh position={[0.3, 0, 0.3]}>
              <cylinderGeometry args={[0.08, 0.08, 0.05, 8]} />
              <meshStandardMaterial {...materialProps} />
            </mesh>
          </>
        )}

        {/* Gaming chair wheels */}
        {type === 'gaming' && (
          <>
            <mesh position={[-0.35, 0, -0.35]}>
              <cylinderGeometry args={[0.1, 0.1, 0.05, 8]} />
              <meshStandardMaterial {...materialProps} />
            </mesh>
            <mesh position={[0.35, 0, -0.35]}>
              <cylinderGeometry args={[0.1, 0.1, 0.05, 8]} />
              <meshStandardMaterial {...materialProps} />
            </mesh>
            <mesh position={[-0.35, 0, 0.35]}>
              <cylinderGeometry args={[0.1, 0.1, 0.05, 8]} />
              <meshStandardMaterial {...materialProps} />
            </mesh>
            <mesh position={[0.35, 0, 0.35]}>
              <cylinderGeometry args={[0.1, 0.1, 0.05, 8]} />
              <meshStandardMaterial {...materialProps} />
            </mesh>
          </>
        )}

        {/* Dining chair legs */}
        {type === 'dining' && (
          <>
            <mesh position={[-0.3, -0.2, -0.3]}>
              <boxGeometry args={[0.05, 0.4, 0.05]} />
              <meshStandardMaterial {...materialProps} />
            </mesh>
            <mesh position={[0.3, -0.2, -0.3]}>
              <boxGeometry args={[0.05, 0.4, 0.05]} />
              <meshStandardMaterial {...materialProps} />
            </mesh>
            <mesh position={[-0.3, -0.2, 0.3]}>
              <boxGeometry args={[0.05, 0.4, 0.05]} />
              <meshStandardMaterial {...materialProps} />
            </mesh>
            <mesh position={[0.3, -0.2, 0.3]}>
              <boxGeometry args={[0.05, 0.4, 0.05]} />
              <meshStandardMaterial {...materialProps} />
            </mesh>
          </>
        )}

        {/* Chair seat */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.6, 0.05, 0.6]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
      </group>

      {/* Chair Back */}
      <group position={[0, 0.4, -0.3]}>
        {/* Office chair back */}
        {type === 'office' && (
          <mesh>
            <boxGeometry args={[0.6, 0.7, 0.08]} />
            <meshStandardMaterial {...materialProps} />
          </mesh>
        )}

        {/* Gaming chair back (high back with wings) */}
        {type === 'gaming' && (
          <>
            {/* Main backrest */}
            <mesh>
              <boxGeometry args={[0.6, 0.9, 0.08]} />
              <meshStandardMaterial {...materialProps} />
            </mesh>
            {/* Side wings */}
            <mesh position={[-0.35, 0.3, -0.1]}>
              <boxGeometry args={[0.1, 0.5, 0.2]} />
              <meshStandardMaterial {...materialProps} />
            </mesh>
            <mesh position={[0.35, 0.3, -0.1]}>
              <boxGeometry args={[0.1, 0.5, 0.2]} />
              <meshStandardMaterial {...materialProps} />
            </mesh>
          </>
        )}

        {/* Dining chair back */}
        {type === 'dining' && (
          <mesh>
            <boxGeometry args={[0.6, 0.6, 0.08]} />
            <meshStandardMaterial {...materialProps} />
          </mesh>
        )}
      </group>

      {/* Chair Armrests */}
      <group position={[0, 0.4, 0]}>
        {/* Office chair armrests */}
        {type === 'office' && (
          <>
            <mesh position={[-0.35, 0.15, 0]}>
              <boxGeometry args={[0.05, 0.15, 0.5]} />
              <meshStandardMaterial {...materialProps} />
            </mesh>
            <mesh position={[0.35, 0.15, 0]}>
              <boxGeometry args={[0.05, 0.15, 0.5]} />
              <meshStandardMaterial {...materialProps} />
            </mesh>
          </>
        )}

        {/* Gaming chair armrests (curved) */}
        {type === 'gaming' && (
          <>
            <mesh position={[-0.35, 0.15, 0]}>
              <boxGeometry args={[0.08, 0.12, 0.6]} />
              <meshStandardMaterial {...materialProps} />
            </mesh>
            <mesh position={[0.35, 0.15, 0]}>
              <boxGeometry args={[0.08, 0.12, 0.6]} />
              <meshStandardMaterial {...materialProps} />
            </mesh>
          </>
        )}
      </group>
    </group>
  );
};

export default Chair;
