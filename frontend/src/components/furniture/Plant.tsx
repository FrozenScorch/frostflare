import React from 'react'

export interface PlantProps {
  position?: [number, number, number]
  rotation?: [number, number, number]
  type?: 'monstera' | 'snake' | 'succulent' | 'ficus'
  size?: number
  potColor?: string
}

const Plant: React.FC<PlantProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  type = 'monstera',
  size = 1,
  potColor = '#cd853f'
}) => {
  const potHeight = 0.5 * size
  const potRadius = 0.25 * size

  // Pot group
  const Pot = () => (
    <group position={[0, potHeight / 2, 0]}>
      {/* Main pot body */}
      <mesh castShadow>
        <cylinderGeometry args={[potRadius * 0.8, potRadius, potHeight, 8]} />
        <meshStandardMaterial color={potColor} />
      </mesh>
      {/* Pot rim */}
      <mesh position={[0, potHeight / 2, 0]} castShadow>
        <cylinderGeometry args={[potRadius * 0.9, potRadius * 1.1, 0.02, 16]} />
        <meshStandardMaterial color={potColor} />
      </mesh>
    </group>
  )

  // Soil
  const Soil = () => (
    <mesh position={[0, potHeight, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <circleGeometry args={[potRadius * 0.8, 8]} />
      <meshStandardMaterial color="#654321" />
    </mesh>
  )

  // Plant type specific components
  const Monstera = () => (
    <group position={[0, potHeight + 0.3, 0]}>
      {/* Main stem */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.02 * size, 0.02 * size, 0.4 * size, 4]} />
        <meshStandardMaterial color="#228b22" />
      </mesh>
      {/* Large leaves */}
      {[-0.2, 0, 0.2].map((x, i) => (
        <mesh key={i} position={[x, 0.2 * size, 0]} rotation={[0, i % 2 === 0 ? Math.PI / 6 : -Math.PI / 6, 0]} castShadow>
          <planeGeometry args={[0.3 * size, 0.4 * size]} />
          <meshStandardMaterial color="#228b22" side={2} />
        </mesh>
      ))}
    </group>
  )

  const SnakePlant = () => (
    <group position={[0, potHeight + 0.1, 0]}>
      {/* Tall stem */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.03 * size, 0.02 * size, 0.6 * size, 6]} />
        <meshStandardMaterial color="#2d5016" />
      </mesh>
      {/* Pointed leaves */}
      {[-0.1, 0, 0.1].map((x, i) => (
        <mesh key={i} position={[x, 0.2 * size, 0]} rotation={[0.1, 0, 0]} castShadow>
          <coneGeometry args={[0.15 * size, 0.3 * size, 4]} />
          <meshStandardMaterial color="#2d5016" />
        </mesh>
      ))}
    </group>
  )

  const Succulent = () => (
    <group position={[0, potHeight + 0.05, 0]}>
      {/* Rosette base */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.1 * size, 0.15 * size, 0.1 * size, 8]} />
        <meshStandardMaterial color="#228b22" />
      </mesh>
      {/* Small rosettes */}
      {Array.from({ length: 5 }, (_, i) => {
        const angle = (i / 5) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.cos(angle) * 0.1, 0.1, Math.sin(angle) * 0.1]} castShadow>
            <sphereGeometry args={[0.08 * size, 4, 4]} />
            <meshStandardMaterial color="#32cd32" />
          </mesh>
        )
      })}
    </group>
  )

  const Ficus = () => (
    <group position={[0, potHeight + 0.1, 0]}>
      {/* Trunk */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.03 * size, 0.04 * size, 0.5 * size, 6]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>
      {/* Canopy */}
      <mesh position={[0, 0.4 * size, 0]} castShadow>
        <sphereGeometry args={[0.2 * size, 8, 6]} />
        <meshStandardMaterial color="#228b22" />
      </mesh>
    </group>
  )

  return (
    <group position={position} rotation={rotation} scale={size}>
      <Pot />
      <Soil />
      {type === 'monstera' && <Monstera />}
      {type === 'snake' && <SnakePlant />}
      {type === 'succulent' && <Succulent />}
      {type === 'ficus' && <Ficus />}
    </group>
  )
}

export default Plant
