/**
 * Speaker Component - Audio speaker for music/listening
 */

import React from "react";
import type { FurnitureComponentProps } from "./FurnitureComponent";

export interface SpeakerProps extends Omit<FurnitureComponentProps, "children"> {
  on?: boolean;
}

export const Speaker: React.FC<SpeakerProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  on = false
}) => {
  const s = scale;

  return (
    <group position={position} rotation={rotation}>
      {/* Speaker box */}
      <mesh position={[0, 0.5 * s, 0]}>
        <boxGeometry args={[0.4 * s, 1 * s, 0.4 * s]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Main woofer */}
      <mesh position={[0, 0.5 * s, 0.21 * s]}>
        <cylinderGeometry args={[0.15 * s, 0.15 * s, 0.05 * s, 32]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>

      {/* Tweeter */}
      <mesh position={[0, 0.8 * s, 0.21 * s]}>
        <cylinderGeometry args={[0.06 * s, 0.06 * s, 0.05 * s, 16]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>

      {/* LED indicator when on */}
      {on && (
        <mesh position={[0, 0.15 * s, 0.21 * s]}>
          <sphereGeometry args={[0.03 * s, 8, 8]} />
          <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={2} />
        </mesh>
      )}
    </group>
  );
};

export default Speaker;
