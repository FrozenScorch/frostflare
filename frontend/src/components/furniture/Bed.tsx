import React from 'react';
import { Box } from '@react-three/drei';

export interface BedProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  size?: 'twin' | 'full' | 'queen' | 'king';
  frameColor?: string;
  beddingColor?: string;
}

const Bed: React.FC<BedProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  size = 'queen',
  frameColor = '#5c4033',
  beddingColor = '#ffffff',
}) => {
  const bedSizes = {
    twin: { width: 1, length: 2 },
    full: { width: 1.4, length: 2 },
    queen: { width: 1.5, length: 2 },
    king: { width: 2, length: 2 },
  };

  const { width, length } = bedSizes[size];

  return (
    <group position={position} rotation={rotation}>
      {/* Bed Frame - Bottom Rails */}
      <Box
        args={[width, 0.1, length]}
        position={[0, 0, 0]}
      >
        <meshStandardMaterial color={frameColor} />
      </Box>

      {/* Bed Frame - Side Rails */}
      <Box
        args={[width, 0.2, 0.1]}
        position={[0, 0.35, length/2 - 0.05]}
      >
        <meshStandardMaterial color={frameColor} />
      </Box>
      <Box
        args={[width, 0.2, 0.1]}
        position={[0, 0.35, -length/2 + 0.05]}
      >
        <meshStandardMaterial color={frameColor} />
      </Box>

      {/* Headboard */}
      <Box
        args={[width, 0.8, 0.1]}
        position={[0, 0.6, length/2 + 0.1]}
      >
        <meshStandardMaterial color={frameColor} />
      </Box>

      {/* Footboard */}
      <Box
        args={[width, 0.6, 0.1]}
        position={[0, 0.3, -length/2 + 0.1]}
      >
        <meshStandardMaterial color={frameColor} />
      </Box>

      {/* Mattress */}
      <Box
        args={[width - 0.1, 0.3, length - 0.2]}
        position={[0, 0.35, 0]}
      >
        <meshStandardMaterial color="#f5f5dc" />
      </Box>

      {/* Pillows */}
      <Box
        args={[0.5, 0.15, 0.3]}
        position={[0, 0.6, length/2 - 0.3]}
        rotation={[0, 0, Math.PI / 20]}
      >
        <meshStandardMaterial color={beddingColor} />
      </Box>
      <Box
        args={[0.5, 0.15, 0.3]}
        position={[0, 0.6, length/2 - 0.6]}
        rotation={[0, 0, -Math.PI / 20]}
      >
        <meshStandardMaterial color={beddingColor} />
      </Box>

      {/* Blanket/Duvet */}
      <Box
        args={[width - 0.1, 0.1, length - 0.3]}
        position={[0, 0.4, 0]}
        rotation={[0, 0, -Math.PI / 40]}
      >
        <meshStandardMaterial color={beddingColor} />
      </Box>

      {/* Sheet wrinkles for realism */}
      <Box
        args={[width - 0.15, 0.05, 0.1]}
        position={[0, 0.42, -0.1]}
        rotation={[0, 0, -Math.PI / 6]}
      >
        <meshStandardMaterial color="#f0f0f0" opacity={0.8} transparent />
      </Box>
    </group>
  );
};

export { Bed };
export default Bed;
