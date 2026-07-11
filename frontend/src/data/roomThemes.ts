/**
 * Room Theme Configurations
 * Defines visual themes, furniture, lighting, and materials for all 9 room types
 */

import type {
  RoomTheme,
  SeatingFurniture,
  SurfaceFurniture,
  ElectronicsFurniture,
  LightingFurniture,
  DecorFurniture,
  PlantFurniture,
  FurniturePreset,
  FurnitureCategory,
  FurnitureMaterial,
  Furniture,
} from "../types/furniture";
import type { RoomType } from "../types/index";

// =============================================================================
// FURNITURE PRESETS
// =============================================================================

/**
 * Helper to create furniture presets
 */
function createPreset(
  id: string,
  name: string,
  category: FurnitureCategory,
  material: FurnitureMaterial,
  defaultColor: string,
  defaultScale: Furniture["scale"]
): FurniturePreset {
  return {
    id,
    name,
    category,
    material,
    defaultColor,
    defaultScale,
    create: (
      position: { x: number; y: number; z: number },
      rotation = { x: 0, y: 0, z: 0 }
    ) => ({
      id,
      name,
      category,
      material,
      color: defaultColor,
      position,
      rotation,
      scale: defaultScale,
    }),
  };
}

// Seating Presets
const gamingChair = createPreset(
  "gaming_chair",
  "Gaming Chair",
  "seating",
  "fabric",
  "#1a1a2e",
  { x: 0.6, y: 1.2, z: 0.6 }
);

const couch = createPreset("couch", "Couch", "seating", "fabric", "#4a4a6a", {
  x: 2.5,
  y: 0.8,
  z: 1,
});

const armchair = createPreset(
  "armchair",
  "Armchair",
  "seating",
  "fabric",
  "#5a5a7a",
  { x: 0.9, y: 0.9, z: 0.9 }
);

const bed = createPreset("bed", "Bed", "seating", "fabric", "#3a3a5a", {
  x: 2,
  y: 0.6,
  z: 2.5,
});

const theaterSeat = createPreset(
  "theater_seat",
  "Theater Seat",
  "seating",
  "fabric",
  "#2a2a2a",
  { x: 0.7, y: 1.1, z: 0.8 }
);

const deskChair = createPreset(
  "desk_chair",
  "Desk Chair",
  "seating",
  "metal",
  "#333333",
  { x: 0.5, y: 1, z: 0.5 }
);

const barStool = createPreset(
  "bar_stool",
  "Bar Stool",
  "seating",
  "metal",
  "#444444",
  { x: 0.4, y: 0.7, z: 0.4 }
);

// Surface Presets
const desk = createPreset("desk", "Desk", "surface", "wood", "#5c4033", {
  x: 1.5,
  y: 0.05,
  z: 0.8,
});

const coffeeTable = createPreset(
  "coffee_table",
  "Coffee Table",
  "surface",
  "wood",
  "#4a3728",
  { x: 1.2, y: 0.05, z: 0.6 }
);

const kitchenCounter = createPreset(
  "kitchen_counter",
  "Kitchen Counter",
  "surface",
  "stone",
  "#888888",
  { x: 2.5, y: 0.05, z: 0.7 }
);

const kitchenIsland = createPreset(
  "kitchen_island",
  "Kitchen Island",
  "surface",
  "stone",
  "#909090",
  { x: 2, y: 0.05, z: 1 }
);

const nightstand = createPreset(
  "nightstand",
  "Nightstand",
  "surface",
  "wood",
  "#5c4033",
  { x: 0.5, y: 0.05, z: 0.5 }
);

const bookshelf = createPreset(
  "bookshelf",
  "Bookshelf",
  "storage",
  "wood",
  "#5c4033",
  { x: 0.8, y: 2, z: 0.3 }
);

// Electronics Presets
const gamingPc = createPreset("gaming_pc", "Gaming PC", "electronics", "metal", "#0a0a0a", {
  x: 0.3,
  y: 0.5,
  z: 0.6,
});

const monitor = createPreset("monitor", "Monitor", "electronics", "plastic", "#111111", {
  x: 0.6,
  y: 0.4,
  z: 0.05,
});

const tv = createPreset("tv", "TV", "electronics", "plastic", "#0a0a0a", {
  x: 1.5,
  y: 0.9,
  z: 0.1,
});

const projectorScreen = createPreset(
  "projector_screen",
  "Projector Screen",
  "electronics",
  "fabric",
  "#ffffff",
  { x: 2.5, y: 1.5, z: 0.05 }
);

const speakers = createPreset("speakers", "Speakers", "electronics", "wood", "#222222", {
  x: 0.3,
  y: 0.8,
  z: 0.3,
});

const gameConsole = createPreset(
  "game_console",
  "Game Console",
  "electronics",
  "plastic",
  "#1a1a1a",
  { x: 0.4,
y: 0.1,
z: 0.3 }
);

// Lighting Presets
const ledStrip = createPreset("led_strip", "LED Strip", "lighting", "plastic", "#00ffff", {
  x: 1,
  y: 0.02,
  z: 0.02,
});

const floorLamp = createPreset(
  "floor_lamp",
  "Floor Lamp",
  "lighting",
  "metal",
  "#333333",
  { x: 0.3, y: 1.5, z: 0.3 }
);

const deskLamp = createPreset("desk_lamp", "Desk Lamp", "lighting", "metal", "#444444", {
  x: 0.2,
  y: 0.5,
  z: 0.2,
});

const pendantLight = createPreset(
  "pendant_light",
  "Pendant Light",
  "lighting",
  "metal",
  "#2a2a2a",
  { x: 0.4, y: 0.3, z: 0.4 }
);

// Decor Presets
const rug = createPreset("rug", "Rug", "decor", "fabric", "#6b4423", {
  x: 2,
  y: 0.01,
  z: 1.5,
});

const wallArt = createPreset("wall_art", "Wall Art", "decor", "wood", "#5c4033", {
  x: 0.8,
  y: 0.6,
  z: 0.05,
});

// Plant Presets
const pottedPlant = createPreset(
  "potted_plant",
  "Potted Plant",
  "plant",
  "stone",
  "#4a6741",
  { x: 0.4, y: 0.6, z: 0.4 }
);

const tree = createPreset("tree", "Tree", "plant", "wood", "#3d5c3d", {
  x: 1,
  y: 3,
  z: 1,
});

const shrub = createPreset("shrub", "Shrub", "plant", "wood", "#4a6b4a", {
  x: 0.8,
  y: 0.8,
  z: 0.8,
});

// Appliance Presets
const refrigerator = createPreset(
  "refrigerator",
  "Refrigerator",
  "appliance",
  "metal",
  "#e0e0e0",
  { x: 0.9, y: 1.8, z: 0.7 }
);

const stove = createPreset("stove", "Stove", "appliance", "metal", "#333333", {
  x: 0.8,
  y: 0.9,
  z: 0.6,
});

// Special Item Presets
const bench = createPreset("bench", "Bench", "seating", "wood", "#6b5a4a", {
  x: 2,
  y: 0.5,
  z: 0.6,
});

const coatRack = createPreset("coat_rack", "Coat Rack", "storage", "wood", "#6b5a4a", {
  x: 0.8,
  y: 2.4,
  z: 0.3,
});

const welcomeMat = createPreset("welcome_mat", "Welcome Mat", "decor", "fabric", "#8b7355", {
  x: 1.5,
  y: 0.01,
  z: 1,
});

// =============================================================================
// ROOM THEME DEFINITIONS
// =============================================================================

/**
 * Game Room Theme
 * Gaming PCs, consoles, LED strips, neon accents
 */
export const gameRoomTheme: RoomTheme = {
  roomType: "game_room",
  name: "Game Room",
  description: "Gaming setup with RGB lighting and multiple gaming stations",
  colors: {
    primary: "#0a0a1a",
    secondary: "#1a1a2e",
    accent: "#00ffff",
    background: "#050510",
    ambient: "#101025",
  },
  lighting: {
    ambientIntensity: 0.3,
    ambientColor: "#0a0a2a",
    mainLightIntensity: 0.6,
    mainLightColor: "#a020f0",
    hasSpotlight: true,
    spotlightColor: "#00ffff",
  },
  furniture: [
    {
      ...gamingChair.create({ x: -2, y: 0, z: -2 }),
      category: "seating",
      material: "fabric",
      seatingCapacity: 1,
      isSittable: true,
      sitPositions: [{ x: -2, y: 0.6, z: -1.5 }],
    } as SeatingFurniture,
    {
      ...gamingChair.create({ x: 2, y: 0, z: -2 }),
      category: "seating",
      material: "fabric",
      seatingCapacity: 1,
      isSittable: true,
      sitPositions: [{ x: 2, y: 0.6, z: -1.5 }],
    } as SeatingFurniture,
    {
      ...desk.create({ x: -2, y: 0.75, z: -2.5 }),
      category: "surface",
      material: "wood",
      surfaceArea: { width: 1.5, depth: 0.8 },
      isStandable: true,
      usableHeight: 0.75,
    } as SurfaceFurniture,
    {
      ...desk.create({ x: 2, y: 0.75, z: -2.5 }),
      category: "surface",
      material: "wood",
      surfaceArea: { width: 1.5, depth: 0.8 },
      isStandable: true,
      usableHeight: 0.75,
    } as SurfaceFurniture,
    {
      ...gamingPc.create({ x: -2.5, y: 0.25, z: -1 }),
      category: "electronics",
      material: "metal",
      isInteractive: true,
      hasScreen: false,
      glowColor: "#00ffff",
    } as ElectronicsFurniture,
    {
      ...gamingPc.create({ x: 1.5, y: 0.25, z: -1 }),
      category: "electronics",
      material: "metal",
      isInteractive: true,
      hasScreen: false,
      glowColor: "#ff00ff",
    } as ElectronicsFurniture,
    {
      ...monitor.create({ x: -2, y: 1, z: -2.8 }),
      category: "electronics",
      material: "plastic",
      isInteractive: true,
      screenType: "monitor",
      hasScreen: true,
      glowColor: "#00ffff",
    } as ElectronicsFurniture,
    {
      ...monitor.create({ x: 2, y: 1, z: -2.8 }),
      category: "electronics",
      material: "plastic",
      isInteractive: true,
      screenType: "monitor",
      hasScreen: true,
      glowColor: "#ff00ff",
    } as ElectronicsFurniture,
    {
      ...ledStrip.create({ x: 0, y: 2.8, z: 0 }),
      category: "lighting",
      material: "plastic",
      lightType: "strip",
      intensity: 1.0,
      color: "#00ffff",
      isDimmable: true,
      castShadow: false,
    } as LightingFurniture,
    {
      ...gameConsole.create({ x: 0, y: 0.05, z: 2 }),
      category: "electronics",
      material: "plastic",
      isInteractive: true,
      hasScreen: false,
      glowColor: "#00ff00",
    } as ElectronicsFurniture,
    {
      ...rug.create({ x: 0, y: 0.01, z: -2 }),
      category: "decor",
      material: "fabric",
      placement: "floor",
    } as DecorFurniture,
  ],
  materials: {
    floor: "carpet",
    walls: "painted",
    ceiling: "painted",
  },
  effects: {
    hasReflections: false,
    hasParticles: true,
    hasBloom: true,
    bloomColor: "#00ffff",
  },
};

/**
 * Living Room Theme
 * Couches, coffee table, TV, ambient lighting
 */
export const livingRoomTheme: RoomTheme = {
  roomType: "living_room",
  name: "Living Room",
  description: "Comfortable seating area with entertainment center",
  colors: {
    primary: "#4a4a6a",
    secondary: "#6a6a8a",
    accent: "#8a6a4a",
    background: "#3a3a5a",
    ambient: "#5a5a7a",
  },
  lighting: {
    ambientIntensity: 0.5,
    ambientColor: "#ffe4c4",
    mainLightIntensity: 0.7,
    mainLightColor: "#fff8dc",
    hasSpotlight: false,
  },
  furniture: [
    {
      ...couch.create({ x: 0, y: 0, z: 3 }),
      category: "seating",
      material: "fabric",
      seatingCapacity: 3,
      isSittable: true,
      sitPositions: [
        { x: -0.8, y: 0.4, z: 3.5 },
        { x: 0, y: 0.4, z: 3.5 },
        { x: 0.8, y: 0.4, z: 3.5 },
      ],
    } as SeatingFurniture,
    {
      ...armchair.create({ x: -3, y: 0, z: 0 }),
      category: "seating",
      material: "fabric",
      seatingCapacity: 1,
      isSittable: true,
      sitPositions: [{ x: -3, y: 0.45, z: 0.3 }],
    } as SeatingFurniture,
    {
      ...armchair.create({ x: 3, y: 0, z: 0 }),
      category: "seating",
      material: "fabric",
      seatingCapacity: 1,
      isSittable: true,
      sitPositions: [{ x: 3, y: 0.45, z: 0.3 }],
    } as SeatingFurniture,
    {
      ...coffeeTable.create({ x: 0, y: 0.4, z: 1.5 }),
      category: "surface",
      material: "wood",
      surfaceArea: { width: 1.2, depth: 0.6 },
      isStandable: false,
      usableHeight: 0.4,
    } as SurfaceFurniture,
    {
      ...tv.create({ x: 0, y: 1.2, z: -4 }),
      category: "electronics",
      material: "plastic",
      isInteractive: true,
      screenType: "tv",
      hasScreen: true,
      glowColor: "#1a1a2a",
    } as ElectronicsFurniture,
    {
      ...floorLamp.create({ x: -3.5, y: 0, z: 3 }),
      category: "lighting",
      material: "metal",
      lightType: "point",
      intensity: 0.8,
      color: "#fff8dc",
      isDimmable: true,
      castShadow: true,
    } as LightingFurniture,
    {
      ...rug.create({ x: 0, y: 0.01, z: 1.5 }),
      category: "decor",
      material: "fabric",
      placement: "floor",
    } as DecorFurniture,
    {
      ...pottedPlant.create({ x: 4, y: 0, z: 4 }),
      category: "plant",
      material: "stone",
      plantType: "potted",
      size: "medium",
    } as PlantFurniture,
  ],
  materials: {
    floor: "hardwood",
    walls: "painted",
    ceiling: "painted",
  },
  effects: {
    hasReflections: false,
    hasParticles: false,
    hasBloom: false,
  },
};

/**
 * Media Room Theme
 * Theater seating, projector screen, dim lighting
 */
export const mediaRoomTheme: RoomTheme = {
  roomType: "media_room",
  name: "Media Room",
  description: "Home theater with projector and tiered seating",
  colors: {
    primary: "#1a1a1a",
    secondary: "#2a2a2a",
    accent: "#3a3a4a",
    background: "#0a0a0a",
    ambient: "#1a1a1a",
  },
  lighting: {
    ambientIntensity: 0.15,
    ambientColor: "#1a1a1a",
    mainLightIntensity: 0.3,
    mainLightColor: "#2a2a2a",
    hasSpotlight: false,
  },
  furniture: [
    {
      ...theaterSeat.create({ x: -2, y: 0.2, z: 2 }),
      category: "seating",
      material: "fabric",
      seatingCapacity: 1,
      isSittable: true,
      sitPositions: [{ x: -2, y: 0.55, z: 2.3 }],
    } as SeatingFurniture,
    {
      ...theaterSeat.create({ x: 0, y: 0.2, z: 2 }),
      category: "seating",
      material: "fabric",
      seatingCapacity: 1,
      isSittable: true,
      sitPositions: [{ x: 0, y: 0.55, z: 2.3 }],
    } as SeatingFurniture,
    {
      ...theaterSeat.create({ x: 2, y: 0.2, z: 2 }),
      category: "seating",
      material: "fabric",
      seatingCapacity: 1,
      isSittable: true,
      sitPositions: [{ x: 2, y: 0.55, z: 2.3 }],
    } as SeatingFurniture,
    {
      ...theaterSeat.create({ x: -2, y: 0.4, z: 0.5 }),
      category: "seating",
      material: "fabric",
      seatingCapacity: 1,
      isSittable: true,
      sitPositions: [{ x: -2, y: 0.75, z: 0.8 }],
    } as SeatingFurniture,
    {
      ...theaterSeat.create({ x: 0, y: 0.4, z: 0.5 }),
      category: "seating",
      material: "fabric",
      seatingCapacity: 1,
      isSittable: true,
      sitPositions: [{ x: 0, y: 0.75, z: 0.8 }],
    } as SeatingFurniture,
    {
      ...theaterSeat.create({ x: 2, y: 0.4, z: 0.5 }),
      category: "seating",
      material: "fabric",
      seatingCapacity: 1,
      isSittable: true,
      sitPositions: [{ x: 2, y: 0.75, z: 0.8 }],
    } as SeatingFurniture,
    {
      ...projectorScreen.create({ x: 0, y: 1.8, z: -3.5 }),
      category: "electronics",
      material: "fabric",
      isInteractive: false,
      screenType: "projector",
      hasScreen: true,
    } as ElectronicsFurniture,
    {
      ...speakers.create({ x: -3.5, y: 1, z: -3 }),
      category: "electronics",
      material: "wood",
      isInteractive: true,
      hasScreen: false,
    } as ElectronicsFurniture,
    {
      ...speakers.create({ x: 3.5, y: 1, z: -3 }),
      category: "electronics",
      material: "wood",
      isInteractive: true,
      hasScreen: false,
    } as ElectronicsFurniture,
  ],
  materials: {
    floor: "carpet",
    walls: "acoustic_panel",
    ceiling: "painted",
  },
  effects: {
    hasReflections: false,
    hasParticles: false,
    hasBloom: true,
    bloomColor: "#ffffff",
  },
};

/**
 * Library Theme
 * Bookshelves, reading nooks, warm desk lamps
 */
export const libraryTheme: RoomTheme = {
  roomType: "library",
  name: "Library",
  description: "Quiet reading space with bookshelves and warm lighting",
  colors: {
    primary: "#5c4033",
    secondary: "#8b7355",
    accent: "#d4a574",
    background: "#4a3528",
    ambient: "#6b5040",
  },
  lighting: {
    ambientIntensity: 0.4,
    ambientColor: "#ffd699",
    mainLightIntensity: 0.6,
    mainLightColor: "#ffcc66",
    hasSpotlight: false,
  },
  furniture: [
    {
      ...bookshelf.create({ x: -4, y: 1, z: -3 }),
      category: "storage",
      material: "wood",
      color: "#5c4033",
      position: { x: -4, y: 1, z: -3 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 0.8, y: 2, z: 0.3 },
    },
    {
      ...bookshelf.create({ x: -4, y: 1, z: -1 }),
      category: "storage",
      material: "wood",
      color: "#5c4033",
      position: { x: -4, y: 1, z: -1 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 0.8, y: 2, z: 0.3 },
    },
    {
      ...bookshelf.create({ x: 4, y: 1, z: -3 }),
      category: "storage",
      material: "wood",
      color: "#5c4033",
      position: { x: 4, y: 1, z: -3 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 0.8, y: 2, z: 0.3 },
    },
    {
      ...bookshelf.create({ x: 4, y: 1, z: -1 }),
      category: "storage",
      material: "wood",
      color: "#5c4033",
      position: { x: 4, y: 1, z: -1 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 0.8, y: 2, z: 0.3 },
    },
    {
      ...desk.create({ x: 0, y: 0.75, z: -3 }),
      category: "surface",
      material: "wood",
      surfaceArea: { width: 1.5, depth: 0.8 },
      isStandable: true,
      usableHeight: 0.75,
    } as SurfaceFurniture,
    {
      ...deskChair.create({ x: 0, y: 0, z: -2 }),
      category: "seating",
      material: "metal",
      seatingCapacity: 1,
      isSittable: true,
      sitPositions: [{ x: 0, y: 0.5, z: -1.7 }],
    } as SeatingFurniture,
    {
      ...armchair.create({ x: -2, y: 0, z: 2 }),
      category: "seating",
      material: "fabric",
      seatingCapacity: 1,
      isSittable: true,
      sitPositions: [{ x: -2, y: 0.45, z: 2.3 }],
    } as SeatingFurniture,
    {
      ...armchair.create({ x: 2, y: 0, z: 2 }),
      category: "seating",
      material: "fabric",
      seatingCapacity: 1,
      isSittable: true,
      sitPositions: [{ x: 2, y: 0.45, z: 2.3 }],
    } as SeatingFurniture,
    {
      ...deskLamp.create({ x: 0, y: 0.75, z: -3.5 }),
      category: "lighting",
      material: "metal",
      lightType: "point",
      intensity: 0.7,
      color: "#ffd699",
      isDimmable: true,
      castShadow: true,
    } as LightingFurniture,
    {
      ...floorLamp.create({ x: -3, y: 0, z: 2 }),
      category: "lighting",
      material: "metal",
      lightType: "point",
      intensity: 0.6,
      color: "#ffcc66",
      isDimmable: true,
      castShadow: true,
    } as LightingFurniture,
    {
      ...rug.create({ x: 0, y: 0.01, z: 0 }),
      category: "decor",
      material: "fabric",
      placement: "floor",
    } as DecorFurniture,
  ],
  materials: {
    floor: "hardwood",
    walls: "wood_panel",
    ceiling: "painted",
  },
  effects: {
    hasReflections: false,
    hasParticles: false,
    hasBloom: false,
  },
};

/**
 * Kitchen Theme
 * Counter, island, bar stools, appliances
 */
export const kitchenTheme: RoomTheme = {
  roomType: "kitchen",
  name: "Kitchen",
  description: "Modern kitchen with island counter and bar seating",
  colors: {
    primary: "#e8e8e8",
    secondary: "#d0d0d0",
    accent: "#a0a0a0",
    background: "#f0f0f0",
    ambient: "#e0e0e0",
  },
  lighting: {
    ambientIntensity: 0.6,
    ambientColor: "#ffffff",
    mainLightIntensity: 0.8,
    mainLightColor: "#fffaf0",
    hasSpotlight: false,
  },
  furniture: [
    {
      ...kitchenCounter.create({ x: -3, y: 0.9, z: -3 }),
      category: "surface",
      material: "stone",
      surfaceArea: { width: 2.5, depth: 0.7 },
      isStandable: true,
      usableHeight: 0.9,
    } as SurfaceFurniture,
    {
      ...kitchenIsland.create({ x: 0, y: 0.9, z: 0 }),
      category: "surface",
      material: "stone",
      surfaceArea: { width: 2, depth: 1 },
      isStandable: true,
      usableHeight: 0.9,
    } as SurfaceFurniture,
    {
      ...barStool.create({ x: -0.7, y: 0, z: 1 }),
      category: "seating",
      material: "metal",
      seatingCapacity: 1,
      isSittable: true,
      sitPositions: [{ x: -0.7, y: 0.35, z: 1.2 }],
    } as SeatingFurniture,
    {
      ...barStool.create({ x: 0, y: 0, z: 1 }),
      category: "seating",
      material: "metal",
      seatingCapacity: 1,
      isSittable: true,
      sitPositions: [{ x: 0, y: 0.35, z: 1.2 }],
    } as SeatingFurniture,
    {
      ...barStool.create({ x: 0.7, y: 0, z: 1 }),
      category: "seating",
      material: "metal",
      seatingCapacity: 1,
      isSittable: true,
      sitPositions: [{ x: 0.7, y: 0.35, z: 1.2 }],
    } as SeatingFurniture,
    {
      ...refrigerator.create({ x: 3, y: 0.9, z: -3 }),
      category: "appliance",
      material: "metal",
      color: "#e0e0e0",
      position: { x: 3, y: 0.9, z: -3 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 0.9, y: 1.8, z: 0.7 },
    },
    {
      ...stove.create({ x: 2, y: 0.45, z: -3 }),
      category: "appliance",
      material: "metal",
      color: "#333333",
      position: { x: 2, y: 0.45, z: -3 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 0.8, y: 0.9, z: 0.6 },
    },
    {
      ...pendantLight.create({ x: 0, y: 2.7, z: 0 }),
      category: "lighting",
      material: "metal",
      lightType: "point",
      intensity: 0.9,
      color: "#fffaf0",
      isDimmable: true,
      castShadow: true,
    } as LightingFurniture,
    {
      ...pendantLight.create({ x: -3, y: 2.7, z: -3 }),
      category: "lighting",
      material: "metal",
      lightType: "point",
      intensity: 0.9,
      color: "#fffaf0",
      isDimmable: true,
      castShadow: true,
    } as LightingFurniture,
  ],
  materials: {
    floor: "tile",
    walls: "tile",
    ceiling: "painted",
  },
  effects: {
    hasReflections: true,
    hasParticles: false,
    hasBloom: false,
  },
};

/**
 * Music Room Theme
 * Instruments, speakers, acoustic treatment
 */
export const musicRoomTheme: RoomTheme = {
  roomType: "music_room",
  name: "Music Room",
  description: "Sound-treated room with instruments and audio equipment",
  colors: {
    primary: "#2a2a3a",
    secondary: "#3a3a4a",
    accent: "#6a4a8a",
    background: "#1a1a2a",
    ambient: "#2a2a3a",
  },
  lighting: {
    ambientIntensity: 0.4,
    ambientColor: "#4a3a5a",
    mainLightIntensity: 0.6,
    mainLightColor: "#8a7a9a",
    hasSpotlight: true,
    spotlightColor: "#ff00ff",
  },
  furniture: [
    {
      ...desk.create({ x: -2, y: 0.75, z: -2 }),
      category: "surface",
      material: "wood",
      surfaceArea: { width: 1.5, depth: 0.8 },
      isStandable: true,
      usableHeight: 0.75,
    } as SurfaceFurniture,
    {
      ...deskChair.create({ x: -2, y: 0, z: -1 }),
      category: "seating",
      material: "metal",
      seatingCapacity: 1,
      isSittable: true,
      sitPositions: [{ x: -2, y: 0.5, z: -0.7 }],
    } as SeatingFurniture,
    {
      ...speakers.create({ x: -3, y: 1, z: -2.5 }),
      category: "electronics",
      material: "wood",
      isInteractive: true,
      hasScreen: false,
    } as ElectronicsFurniture,
    {
      ...speakers.create({ x: -1, y: 1, z: -2.5 }),
      category: "electronics",
      material: "wood",
      isInteractive: true,
      hasScreen: false,
    } as ElectronicsFurniture,
    {
      ...speakers.create({ x: 2, y: 1, z: -2 }),
      category: "electronics",
      material: "wood",
      isInteractive: true,
      hasScreen: false,
    } as ElectronicsFurniture,
    {
      ...speakers.create({ x: 2, y: 1, z: 2 }),
      category: "electronics",
      material: "wood",
      isInteractive: true,
      hasScreen: false,
    } as ElectronicsFurniture,
    {
      ...armchair.create({ x: 0, y: 0, z: 2 }),
      category: "seating",
      material: "fabric",
      seatingCapacity: 1,
      isSittable: true,
      sitPositions: [{ x: 0, y: 0.45, z: 2.3 }],
    } as SeatingFurniture,
    {
      ...ledStrip.create({ x: 0, y: 2.8, z: 0 }),
      category: "lighting",
      material: "plastic",
      lightType: "strip",
      intensity: 0.8,
      color: "#ff00ff",
      isDimmable: true,
      castShadow: false,
    } as LightingFurniture,
    {
      ...rug.create({ x: 0, y: 0.01, z: 0 }),
      category: "decor",
      material: "fabric",
      placement: "floor",
    } as DecorFurniture,
    {
      ...wallArt.create({ x: -3.9, y: 1.5, z: 0 }),
      category: "decor",
      material: "wood",
      placement: "wall",
      position: { x: -3.9, y: 1.5, z: 0 },
      rotation: { x: 0, y: 90, z: 0 },
      scale: { x: 0.05, y: 0.6, z: 0.8 },
    } as DecorFurniture,
  ],
  materials: {
    floor: "carpet",
    walls: "acoustic_panel",
    ceiling: "acoustic_tile",
  },
  effects: {
    hasReflections: false,
    hasParticles: false,
    hasBloom: true,
    bloomColor: "#ff00ff",
  },
};

/**
 * Garden Theme
 * Trees, plants, outdoor seating, path
 */
export const gardenTheme: RoomTheme = {
  roomType: "garden",
  name: "Garden",
  description: "Outdoor space with plants, trees, and seating areas",
  colors: {
    primary: "#4a6741",
    secondary: "#5a7851",
    accent: "#8a9a61",
    background: "#3a5731",
    ambient: "#4a6741",
  },
  lighting: {
    ambientIntensity: 0.7,
    ambientColor: "#fffacd",
    mainLightIntensity: 0.9,
    mainLightColor: "#ffffff",
    hasSpotlight: false,
  },
  furniture: [
    {
      ...tree.create({ x: -4, y: 1.5, z: -4 }),
      category: "plant",
      material: "wood",
      plantType: "tree",
      size: "large",
      position: { x: -4, y: 1.5, z: -4 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 3, z: 1 },
    } as PlantFurniture,
    {
      ...tree.create({ x: 4, y: 1.5, z: -4 }),
      category: "plant",
      material: "wood",
      plantType: "tree",
      size: "large",
      position: { x: 4, y: 1.5, z: -4 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 3, z: 1 },
    } as PlantFurniture,
    {
      ...tree.create({ x: -4, y: 1.5, z: 4 }),
      category: "plant",
      material: "wood",
      plantType: "tree",
      size: "large",
      position: { x: -4, y: 1.5, z: 4 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 3, z: 1 },
    } as PlantFurniture,
    {
      ...tree.create({ x: 4, y: 1.5, z: 4 }),
      category: "plant",
      material: "wood",
      plantType: "tree",
      size: "large",
      position: { x: 4, y: 1.5, z: 4 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 3, z: 1 },
    } as PlantFurniture,
    {
      ...shrub.create({ x: -2, y: 0.4, z: -5 }),
      category: "plant",
      material: "wood",
      plantType: "shrub",
      size: "medium",
      position: { x: -2, y: 0.4, z: -5 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 0.8, y: 0.8, z: 0.8 },
    } as PlantFurniture,
    {
      ...shrub.create({ x: 2, y: 0.4, z: -5 }),
      category: "plant",
      material: "wood",
      plantType: "shrub",
      size: "medium",
      position: { x: 2, y: 0.4, z: -5 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 0.8, y: 0.8, z: 0.8 },
    } as PlantFurniture,
    {
      ...shrub.create({ x: -5, y: 0.4, z: 0 }),
      category: "plant",
      material: "wood",
      plantType: "shrub",
      size: "medium",
      position: { x: -5, y: 0.4, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 0.8, y: 0.8, z: 0.8 },
    } as PlantFurniture,
    {
      ...shrub.create({ x: 5, y: 0.4, z: 0 }),
      category: "plant",
      material: "wood",
      plantType: "shrub",
      size: "medium",
      position: { x: 5, y: 0.4, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 0.8, y: 0.8, z: 0.8 },
    } as PlantFurniture,
    {
      ...bench.create({ x: 0, y: 0, z: 0 }),
      category: "seating",
      material: "wood",
      seatingCapacity: 3,
      isSittable: true,
      sitPositions: [
        { x: -0.7, y: 0.5, z: 0.3 },
        { x: 0, y: 0.5, z: 0.3 },
        { x: 0.7, y: 0.5, z: 0.3 },
      ],
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 2, y: 0.5, z: 0.6 },
    } as SeatingFurniture,
    {
      ...pottedPlant.create({ x: -3, y: 0, z: 3 }),
      category: "plant",
      material: "stone",
      plantType: "potted",
      size: "small",
      position: { x: -3, y: 0, z: 3 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 0.4, y: 0.6, z: 0.4 },
    } as PlantFurniture,
    {
      ...pottedPlant.create({ x: 3, y: 0, z: 3 }),
      category: "plant",
      material: "stone",
      plantType: "potted",
      size: "small",
      position: { x: 3, y: 0, z: 3 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 0.4, y: 0.6, z: 0.4 },
    } as PlantFurniture,
    {
      ...pottedPlant.create({ x: 0, y: 0, z: 5 }),
      category: "plant",
      material: "stone",
      plantType: "potted",
      size: "small",
      position: { x: 0, y: 0, z: 5 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 0.5, y: 0.8, z: 0.5 },
    } as PlantFurniture,
  ],
  materials: {
    floor: "grass",
    walls: "none",
    ceiling: "sky",
  },
  effects: {
    hasReflections: false,
    hasParticles: true,
    hasBloom: false,
  },
};

/**
 * Bedroom Theme
 * Bed, nightstand, ambient lighting
 */
export const bedroomTheme: RoomTheme = {
  roomType: "bedroom",
  name: "Bedroom",
  description: "Cozy bedroom with bed and warm ambient lighting",
  colors: {
    primary: "#3a3a5a",
    secondary: "#4a4a6a",
    accent: "#6a5a8a",
    background: "#2a2a4a",
    ambient: "#3a3a5a",
  },
  lighting: {
    ambientIntensity: 0.3,
    ambientColor: "#ffe4e1",
    mainLightIntensity: 0.5,
    mainLightColor: "#ffd1dc",
    hasSpotlight: false,
  },
  furniture: [
    {
      ...bed.create({ x: 0, y: 0.3, z: 0 }),
      category: "seating",
      material: "fabric",
      seatingCapacity: 2,
      isSittable: true,
      sitPositions: [
        { x: -0.5, y: 0.3, z: 0.5 },
        { x: 0.5, y: 0.3, z: 0.5 },
      ],
      position: { x: 0, y: 0.3, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 2, y: 0.6, z: 2.5 },
    } as SeatingFurniture,
    {
      ...nightstand.create({ x: -1.5, y: 0.4, z: 0 }),
      category: "surface",
      material: "wood",
      surfaceArea: { width: 0.5, depth: 0.5 },
      isStandable: false,
      usableHeight: 0.4,
    } as SurfaceFurniture,
    {
      ...nightstand.create({ x: 1.5, y: 0.4, z: 0 }),
      category: "surface",
      material: "wood",
      surfaceArea: { width: 0.5, depth: 0.5 },
      isStandable: false,
      usableHeight: 0.4,
    } as SurfaceFurniture,
    {
      ...deskLamp.create({ x: -1.5, y: 0.4, z: 0 }),
      category: "lighting",
      material: "metal",
      lightType: "point",
      intensity: 0.6,
      color: "#ffd1dc",
      isDimmable: true,
      castShadow: true,
      position: { x: -1.5, y: 0.4, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 0.2, y: 0.5, z: 0.2 },
    } as LightingFurniture,
    {
      ...deskLamp.create({ x: 1.5, y: 0.4, z: 0 }),
      category: "lighting",
      material: "metal",
      lightType: "point",
      intensity: 0.6,
      color: "#ffd1dc",
      isDimmable: true,
      castShadow: true,
      position: { x: 1.5, y: 0.4, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 0.2, y: 0.5, z: 0.2 },
    } as LightingFurniture,
    {
      ...armchair.create({ x: -3, y: 0, z: -3 }),
      category: "seating",
      material: "fabric",
      seatingCapacity: 1,
      isSittable: true,
      sitPositions: [{ x: -3, y: 0.45, z: -2.7 }],
    } as SeatingFurniture,
    {
      ...rug.create({ x: 0, y: 0.01, z: 2 }),
      category: "decor",
      material: "fabric",
      placement: "floor",
      position: { x: 0, y: 0.01, z: 2 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1.5, y: 0.01, z: 1.2 },
    } as DecorFurniture,
    {
      ...pottedPlant.create({ x: 3, y: 0, z: -3 }),
      category: "plant",
      material: "stone",
      plantType: "potted",
      size: "medium",
      position: { x: 3, y: 0, z: -3 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 0.5, y: 0.7, z: 0.5 },
    } as PlantFurniture,
  ],
  materials: {
    floor: "hardwood",
    walls: "painted",
    ceiling: "painted",
  },
  effects: {
    hasReflections: false,
    hasParticles: false,
    hasBloom: false,
  },
};

/**
 * Entrance Theme
 * Welcome mat, coat rack, foyer lighting
 */
export const entranceTheme: RoomTheme = {
  roomType: "entrance",
  name: "Entrance",
  description: "Welcoming entrance area with coat storage and foyer lighting",
  colors: {
    primary: "#8a7a6a",
    secondary: "#9a8a7a",
    accent: "#baa98a",
    background: "#7a6a5a",
    ambient: "#8a7a6a",
  },
  lighting: {
    ambientIntensity: 0.6,
    ambientColor: "#fff8dc",
    mainLightIntensity: 0.8,
    mainLightColor: "#fffaf0",
    hasSpotlight: false,
  },
  furniture: [
    {
      ...coatRack.create({ x: -3, y: 1.2, z: -3 }),
      category: "storage",
      material: "wood",
      color: "#6b5a4a",
      position: { x: -3, y: 1.2, z: -3 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 0.8, y: 2.4, z: 0.3 },
    },
    {
      ...bench.create({ x: 3, y: 0.25, z: -3 }),
      category: "seating",
      material: "wood",
      seatingCapacity: 2,
      isSittable: true,
      sitPositions: [
        { x: 2.7, y: 0.5, z: -2.7 },
        { x: 3.3, y: 0.5, z: -2.7 },
      ],
      position: { x: 3, y: 0.25, z: -3 },
      rotation: { x: 0, y: 90, z: 0 },
      scale: { x: 1.2, y: 0.5, z: 0.4 },
    } as SeatingFurniture,
    {
      ...welcomeMat.create({ x: 0, y: 0.01, z: 3.5 }),
      category: "decor",
      material: "fabric",
      placement: "floor",
      position: { x: 0, y: 0.01, z: 3.5 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1.5, y: 0.01, z: 1 },
    } as DecorFurniture,
    {
      ...pendantLight.create({ x: 0, y: 2.7, z: 0 }),
      category: "lighting",
      material: "metal",
      lightType: "point",
      intensity: 0.8,
      color: "#fffaf0",
      isDimmable: true,
      castShadow: true,
    } as LightingFurniture,
    {
      ...pottedPlant.create({ x: -3.5, y: 0, z: 3 }),
      category: "plant",
      material: "stone",
      plantType: "potted",
      size: "medium",
      position: { x: -3.5, y: 0, z: 3 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 0.5, y: 0.7, z: 0.5 },
    } as PlantFurniture,
    {
      ...wallArt.create({ x: 0, y: 1.5, z: -3.9 }),
      category: "decor",
      material: "wood",
      placement: "wall",
      position: { x: 0, y: 1.5, z: -3.9 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 0.8, y: 0.6, z: 0.05 },
    } as DecorFurniture,
  ],
  materials: {
    floor: "tile",
    walls: "painted",
    ceiling: "painted",
  },
  effects: {
    hasReflections: true,
    hasParticles: false,
    hasBloom: false,
  },
};

// =============================================================================
// EXPORTS
// =============================================================================

/**
 * Map of room type to theme configuration
 */
export const roomThemes: Record<RoomType, RoomTheme> = {
  game_room: gameRoomTheme,
  living_room: livingRoomTheme,
  media_room: mediaRoomTheme,
  library: libraryTheme,
  kitchen: kitchenTheme,
  music_room: musicRoomTheme,
  garden: gardenTheme,
  bedroom: bedroomTheme,
  entrance: entranceTheme,
};

/**
 * Get theme for a specific room type
 */
export function getRoomTheme(roomType: RoomType): RoomTheme {
  return roomThemes[roomType];
}

/**
 * Get all furniture for a specific room type
 */
export function getRoomFurniture(roomType: RoomType) {
  return roomThemes[roomType].furniture;
}

/**
 * Get sittable positions for a specific room type
 */
export function getSittablePositions(roomType: RoomType): Array<{ x: number; y: number; z: number }> {
  const theme = roomThemes[roomType];
  const positions: Array<{ x: number; y: number; z: number }> = [];

  for (const furniture of theme.furniture) {
    if (furniture.category === "seating" && "sitPositions" in furniture) {
      positions.push(...furniture.sitPositions);
    }
  }

  return positions;
}

/**
 * Get standing/near positions for a specific room type
 * (usable surfaces like desks, counters, etc.)
 */
export function getStandingPositions(roomType: RoomType): Array<{ x: number; y: number; z: number }> {
  const theme = roomThemes[roomType];
  const positions: Array<{ x: number; y: number; z: number }> = [];

  for (const furniture of theme.furniture) {
    if (
      (furniture.category === "surface" &&
        "isStandable" in furniture &&
        furniture.isStandable) ||
      (furniture.category === "electronics" &&
        "isInteractive" in furniture &&
        furniture.isInteractive)
    ) {
      positions.push({
        x: furniture.position.x,
        y: furniture.position.y + furniture.scale.y / 2,
        z: furniture.position.z,
      });
    }
  }

  return positions;
}

export default roomThemes;
