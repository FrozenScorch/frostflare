/**
 * Furniture Type Definitions
 * Defines all furniture types that can be placed in rooms
 */

import type { RoomType } from "./index";

/**
 * Base furniture category types
 */
export type FurnitureCategory =
  | "seating"
  | "surface"
  | "storage"
  | "electronics"
  | "lighting"
  | "decor"
  | "appliance"
  | "plant"
  | "flooring";

/**
 * Furniture material types for rendering
 */
export type FurnitureMaterial =
  | "wood"
  | "metal"
  | "fabric"
  | "plastic"
  | "glass"
  | "leather"
  | "stone"
  | "carpet";

/**
 * Base furniture interface
 */
export interface Furniture {
  id: string;
  name: string;
  category: FurnitureCategory;
  material: FurnitureMaterial;
  color: string; // Hex color
  position: {
    x: number;
    y: number;
    z: number;
  };
  rotation: {
    x: number;
    y: number;
    z: number;
  };
  scale: {
    x: number;
    y: number;
    z: number;
  };
}

/**
 * Seating furniture (chairs, couches, beds)
 */
export interface SeatingFurniture extends Furniture {
  category: "seating";
  seatingCapacity: number;
  isSittable: true;
  sitPositions: Array<{
    x: number;
    y: number;
    z: number;
  }>;
}

/**
 * Surface furniture (tables, counters, desks)
 */
export interface SurfaceFurniture extends Furniture {
  category: "surface";
  surfaceArea: {
    width: number;
    depth: number;
  };
  isStandable?: boolean; // Can users stand/near it for activities
  usableHeight: number;
}

/**
 * Electronics furniture (TVs, PCs, speakers, consoles)
 */
export interface ElectronicsFurniture extends Furniture {
  category: "electronics";
  isInteractive: boolean;
  screenType?: "tv" | "monitor" | "projector" | "none";
  hasScreen: boolean;
  glowColor?: string; // For LED indicators, power lights
}

/**
 * Lighting furniture
 */
export interface LightingFurniture extends Furniture {
  category: "lighting";
  lightType: "ambient" | "spot" | "point" | "strip";
  intensity: number;
  color: string; // Light color in hex
  isDimmable: boolean;
  castShadow: boolean;
}

/**
 * Decorative items (posters, rugs, wall art)
 */
export interface DecorFurniture extends Furniture {
  category: "decor";
  placement: "floor" | "wall" | "ceiling" | "table";
}

/**
 * Plant furniture
 */
export interface PlantFurniture extends Furniture {
  category: "plant";
  plantType: "tree" | "shrub" | "potted" | "hanging";
  size: "small" | "medium" | "large";
}

/**
 * Union type for all furniture
 */
export type AnyFurniture =
  | SeatingFurniture
  | SurfaceFurniture
  | ElectronicsFurniture
  | LightingFurniture
  | DecorFurniture
  | PlantFurniture
  | Furniture;

/**
 * Room theme configuration
 */
export interface RoomTheme {
  roomType: RoomType;
  name: string;
  description: string;

  // Color palette
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    ambient: string;
  };

  // Lighting settings
  lighting: {
    ambientIntensity: number;
    ambientColor: string;
    mainLightIntensity: number;
    mainLightColor: string;
    hasSpotlight: boolean;
    spotlightColor?: string;
  };

  // Furniture list for this room
  furniture: AnyFurniture[];

  // Floor and wall settings
  materials: {
    floor: string;
    walls: string;
    ceiling?: string;
  };

  // Special effects (for Phase 3)
  effects?: {
    hasReflections: boolean;
    hasParticles: boolean;
    hasBloom: boolean;
    bloomColor?: string;
  };
}

/**
 * Furniture preset for common items
 * Can be used as templates when instantiating furniture
 */
export interface FurniturePreset {
  id: string;
  name: string;
  category: FurnitureCategory;
  material: FurnitureMaterial;
  defaultColor: string;
  defaultScale: {
    x: number;
    y: number;
    z: number;
  };
  // Factory function to create instance with position
  create: (
    position: { x: number; y: number; z: number },
    rotation?: { x: number; y: number; z: number }
  ) => Furniture;
}
