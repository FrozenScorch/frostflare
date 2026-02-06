/**
 * Animation Utilities for Three.js
 */

import type { Vector3D, AnimationType } from "../types";

/**
 * Linear interpolation between two values
 */
export function lerp(start: number, end: number, t: number): number {
  return start * (1 - t) + end * t;
}

/**
 * Linear interpolation between two 3D vectors
 */
export function lerpVector3(start: Vector3D, end: Vector3D, t: number): Vector3D {
  return {
    x: lerp(start.x, end.x, t),
    y: lerp(start.y, end.y, t),
    z: lerp(start.z, end.z, t),
  };
}

/**
 * Calculate distance between two 3D points
 */
export function distance3D(a: Vector3D, b: Vector3D): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = a.z - b.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Smooth damp for animation (like Unity's SmoothDamp)
 */
export function smoothDamp(
  current: number,
  target: number,
  velocity: { value: number },
  smoothTime: number,
  deltaTime: number,
  maxSpeed: number = Infinity
): number {
  smoothTime = Math.max(0.0001, smoothTime);
  const omega = 2 / smoothTime;
  const x = omega * deltaTime;
  const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
  const change = current - target;
  const maxChange = maxSpeed * smoothTime;
  const clampedChange = Math.max(-maxChange, Math.min(maxChange, change));
  const temp = (velocity.value - omega * clampedChange) * exp;
  velocity.value = (velocity.value + omega * temp) * exp;
  const result = target + (clampedChange + temp) * exp;

  if (target - current > 0 === result > target) {
    velocity.value = 0;
    return target;
  }

  return result;
}

/**
 * Get animation speed multiplier based on animation type
 */
export function getAnimationSpeed(animation: AnimationType): number {
  switch (animation) {
    case "walk":
      return 1.0;
    case "talk":
      return 0.3;
    case "gesture":
      return 0.5;
    case "dance":
      return 1.5;
    case "sleep":
      return 0.1;
    case "idle":
    default:
      return 0.2;
  }
}

/**
 * Bobbing animation for idle state
 */
export function getIdleBobbing(time: number): number {
  return Math.sin(time * 2) * 0.05;
}

/**
 * Walking bounce animation
 */
export function getWalkingBounce(time: number): number {
  return Math.abs(Math.sin(time * 5)) * 0.1;
}

/**
 * Talking animation (scale pulse)
 */
export function getTalkingPulse(time: number): number {
  return 1 + Math.sin(time * 10) * 0.05;
}

/**
 * Typing animation (rapid scale changes)
 */
export function getTypingPulse(time: number): number {
  return 1 + Math.sin(time * 15) * 0.03;
}

/**
 * Rotation angle for looking at a target
 */
export function lookAtAngle(from: Vector3D, to: Vector3D): number {
  const dx = to.x - from.x;
  const dz = to.z - from.z;
  return Math.atan2(dx, dz);
}
