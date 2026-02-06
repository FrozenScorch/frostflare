/**
 * UserAvatar Component - 3D Avatar for Discord Users
 */

import React, { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { TextureLoader } from "three";
import type { UserState } from "../types";
import { lerpVector3, distance3D, getIdleBobbing, getWalkingBounce } from "../utils/animation";

interface UserAvatarProps {
  user: UserState;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ user }) => {
  const groupRef = useRef<THREE.Group>(null);
  const avatarRef = useRef<THREE.Mesh>(null);
  const bubbleRef = useRef<THREE.Group>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  // Load avatar texture
  useEffect(() => {
    const loader = new TextureLoader();
    loader.load(
      user.avatar,
      (loadedTexture) => {
        setTexture(loadedTexture);
      },
      undefined,
      (error) => {
        console.error(`Error loading avatar for ${user.username}:`, error);
      }
    );
  }, [user.avatar]);

  // Animate avatar
  useFrame((state) => {
    if (!groupRef.current) return;

    const time = state.clock.getElapsedTime();
    const delta = state.clock.getDelta();

    // Interpolate position towards target
    const currentPos = groupRef.current.position;
    const speed = 2.0 * delta;

    const dist = distance3D(
      { x: currentPos.x, y: currentPos.y, z: currentPos.z },
      user.targetPosition
    );

    if (dist > 0.01) {
      const t = Math.min(speed / dist, 1);
      const newPos = lerpVector3(
        { x: currentPos.x, y: currentPos.y, z: currentPos.z },
        user.targetPosition,
        t
      );
      currentPos.x = newPos.x;
      currentPos.y = newPos.y;
      currentPos.z = newPos.z;
    }

    // Apply animation bobbing
    let bobY = 0;
    if (user.animation === "walk") {
      bobY = getWalkingBounce(time);
    } else if (user.animation === "idle") {
      bobY = getIdleBobbing(time);
    }

    if (avatarRef.current) {
      avatarRef.current.position.y = 0.5 + bobY;
    }

    // Rotate avatar to face direction of movement
    if (dist > 0.01) {
      const angle = Math.atan2(
        user.targetPosition.x - currentPos.x,
        user.targetPosition.z - currentPos.z
      );
      groupRef.current.rotation.y = angle;
    }

    // Update speech bubble
    if (bubbleRef.current && user.speechBubble) {
      bubbleRef.current.visible = true;
    } else if (bubbleRef.current) {
      bubbleRef.current.visible = false;
    }
  });

  // Get color based on mood
  const getMoodColor = () => {
    switch (user.mood) {
      case "happy":
        return "#ffff00";
      case "excited":
        return "#ff8800";
      case "focused":
        return "#00ffff";
      case "bored":
        return "#888888";
      case "sad":
        return "#8888ff";
      default:
        return "#ffffff";
    }
  };

  return (
    <group ref={groupRef} position={[user.position.x, user.position.y, user.position.z]}>
      {/* Avatar body */}
      <mesh ref={avatarRef} castShadow>
        <cylinderGeometry args={[0.3, 0.4, 0.8, 8]} />
        <meshStandardMaterial color={getMoodColor()} />
      </mesh>

      {/* Avatar head with profile picture */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <sphereGeometry args={[0.35, 16, 16]} />
        {texture ? (
          <meshStandardMaterial map={texture} />
        ) : (
          <meshStandardMaterial color="#7289da" />
        )}
      </mesh>

      {/* Speech bubble */}
      {user.speechBubble && (
        <group ref={bubbleRef} position={[0, 2, 0]}>
          {/* Bubble background */}
          <mesh position={[0, 0, 0]}>
            <planeGeometry args={[2, 0.5]} />
            <meshBasicMaterial color="#ffffff" opacity={0.9} transparent />
          </mesh>

          {/* Note: Text would need TextGeometry or HTML overlay */}
        </group>
      )}

      {/* Typing indicator */}
      {user.isTyping && (
        <mesh position={[0, 1.8, 0.5]}>
          <planeGeometry args={[0.5, 0.2]} />
          <meshBasicMaterial color="#00ff00" />
        </mesh>
      )}

      {/* Action icon above head */}
      <mesh position={[0.5, 2.5, 0]}>
        <planeGeometry args={[0.3, 0.3]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Shadow on ground */}
      <mesh position={[0, 0.01, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.4, 16]} />
        <meshBasicMaterial color="#000000" opacity={0.3} transparent />
      </mesh>
    </group>
  );
};

export default UserAvatar;
