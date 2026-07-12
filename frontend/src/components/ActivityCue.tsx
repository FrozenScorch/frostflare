import React from "react";
import { Html } from "@react-three/drei";
import type { UserState } from "../types";
import { getActivityPresentation } from "../data/activityPresentation";

const Headphones: React.FC = () => (
  <group position={[0, 1.05, 0]}>
    <mesh>
      <torusGeometry args={[0.34, 0.045, 8, 20, Math.PI]} />
      <meshStandardMaterial color="#151923" metalness={0.45} roughness={0.35} />
    </mesh>
    {[-0.34, 0.34].map((x) => (
      <mesh key={x} position={[x, -0.02, 0]}>
        <boxGeometry args={[0.09, 0.23, 0.18]} />
        <meshStandardMaterial color="#ff665c" emissive="#7d1f1a" emissiveIntensity={0.45} />
      </mesh>
    ))}
  </group>
);

const Computer: React.FC = () => (
  <group position={[0, 0.56, 0.42]}>
    <mesh position={[0, 0.16, 0]}>
      <boxGeometry args={[0.52, 0.36, 0.06]} />
      <meshStandardMaterial color="#171b26" />
    </mesh>
    <mesh position={[0, 0.16, 0.035]}>
      <boxGeometry args={[0.43, 0.27, 0.015]} />
      <meshStandardMaterial color="#4f7dff" emissive="#294cb7" emissiveIntensity={0.8} />
    </mesh>
    <mesh position={[0, -0.08, 0.15]} rotation={[-0.4, 0, 0]}>
      <boxGeometry args={[0.48, 0.03, 0.2]} />
      <meshStandardMaterial color="#202633" />
    </mesh>
  </group>
);

const Book: React.FC = () => (
  <group position={[0, 0.55, 0.4]} rotation={[-0.3, 0, 0]}>
    <mesh position={[-0.14, 0, 0]} rotation={[0, 0.15, 0.08]}>
      <boxGeometry args={[0.28, 0.03, 0.38]} />
      <meshStandardMaterial color="#f3e7c9" />
    </mesh>
    <mesh position={[0.14, 0, 0]} rotation={[0, -0.15, -0.08]}>
      <boxGeometry args={[0.28, 0.03, 0.38]} />
      <meshStandardMaterial color="#f3e7c9" />
    </mesh>
  </group>
);

export const ActivityCue: React.FC<{ user: UserState }> = ({ user }) => {
  const presentation = getActivityPresentation(user);

  return (
    <>
      {user.action === "listening" && <Headphones />}
      {(user.action === "gaming" || user.action === "typing" || user.isTyping) && <Computer />}
      {user.action === "reading" && <Book />}
      <Html position={[0, 1.72, 0]} center distanceFactor={12}>
        <div style={{
          alignItems: "center",
          background: "rgba(10, 13, 20, 0.86)",
          border: `1px solid ${presentation.color}`,
          borderRadius: "999px",
          color: "#f7f9fc",
          display: "flex",
          fontFamily: "system-ui, sans-serif",
          fontSize: "11px",
          fontWeight: 700,
          gap: "4px",
          lineHeight: 1,
          padding: "4px 7px",
          pointerEvents: "none",
          whiteSpace: "nowrap",
        }}>
          <span>{presentation.icon}</span>
          <span>{presentation.label}</span>
        </div>
      </Html>
    </>
  );
};

export default ActivityCue;
