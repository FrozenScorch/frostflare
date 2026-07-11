import React from 'react';

export interface GamingPCProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  rgbColor?: string;
  caseColor?: string;
}

export const GamingPC: React.FC<GamingPCProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  rgbColor = '#00ff00',
  caseColor = '#1a1a1a'
}) => {
  const PCCase: React.FC = () => (
    <group>
      {/* Main tower case */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[0.4, 1, 0.4]} />
        <meshStandardMaterial color={caseColor} />
      </mesh>

      {/* Side panel window */}
      <mesh position={[0.2, 0.5, 0]} castShadow>
        <boxGeometry args={[0.05, 0.9, 0.35]} />
        <meshStandardMaterial
          color="#000033"
          transparent
          opacity={0.8}
          emissive="#000044"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* RGB strip on front */}
      <mesh position={[0, 0.25, 0.21]} castShadow>
        <boxGeometry args={[0.38, 0.9, 0.02]} />
        <meshStandardMaterial
          color={rgbColor}
          emissive={rgbColor}
          emissiveIntensity={0.8}
        />
      </mesh>
    </group>
  );

  const Monitor: React.FC = () => (
    <group>
      {/* Monitor back */}
      <mesh position={[0, 1.2, -0.3]} castShadow>
        <boxGeometry args={[0.35, 0.22, 0.02]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>

      {/* Monitor screen */}
      <mesh position={[0, 1.2, -0.4]} castShadow>
        <boxGeometry args={[0.32, 0.19, 0.01]} />
        <meshStandardMaterial
          color="#111122"
          emissive="#1122ff"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Monitor stand */}
      <mesh position={[0, 1.0, -0.3]} castShadow>
        <boxGeometry args={[0.05, 0.2, 0.05]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Monitor base */}
      <mesh position={[0, 0.95, -0.3]} castShadow>
        <boxGeometry args={[0.3, 0.03, 0.1]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
    </group>
  );

  const Keyboard: React.FC = () => (
    <group>
      {/* Keyboard base */}
      <mesh position={[0, 0.95, 0.35]} castShadow>
        <boxGeometry args={[0.4, 0.02, 0.15]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>

      {/* Keyboard keys */}
      <mesh position={[0, 0.96, 0.35]} castShadow>
        <boxGeometry args={[0.37, 0.005, 0.13]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
    </group>
  );

  const Mouse: React.FC = () => (
    <group position={[0.25, 0.95, 0.35]}>
      {/* Mouse body */}
      <mesh castShadow>
        <boxGeometry args={[0.08, 0.03, 0.14]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>

      {/* Mouse scroll wheel */}
      <mesh position={[0, 0.02, -0.05]} castShadow>
        <cylinderGeometry args={[0.01, 0.01, 0.01, 8]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
    </group>
  );

  return (
    <group position={position} rotation={rotation}>
      <Monitor />
      <PCCase />
      <Keyboard />
      <Mouse />
    </group>
  );
};
