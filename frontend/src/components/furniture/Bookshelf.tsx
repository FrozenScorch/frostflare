import React, { useMemo } from 'react';


export interface BookshelfProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  shelves?: number;
  width?: number;
  woodColor?: string;
  filled?: boolean;
}

const Bookshelf: React.FC<BookshelfProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  shelves = 5,
  width = 3,
  woodColor = '#8b4513',
  filled = true,
}) => {
  const bookColors = [
    '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b',
    '#eb4d4b', '#6ab04c', '#130f40', '#30336b', '#95afc0',
    '#f8b500', '#ff3838', '#2ed573', '#1e90ff', '#ffa502'
  ];

  const shelfGroup = useMemo(() => {
    const group: JSX.Element[] = [];
    const shelfHeight = 0.3;
    const shelfDepth = 0.1;
    const totalHeight = shelves * 0.8;
    const backPanelThickness = 0.05;

    // Back panel
    group.push(
      <mesh
        key="backPanel"
        position={[0, totalHeight / 2 - 0.4, -width / 2 + shelfDepth]}
      >
        <boxGeometry args={[width, totalHeight, backPanelThickness]} />
        <meshStandardMaterial color={woodColor} />
      </mesh>
    );

    // Side panels
    group.push(
      <mesh
        key="leftPanel"
        position={[-width / 2, totalHeight / 2 - 0.4, 0]}
      >
        <boxGeometry args={[shelfDepth, totalHeight, width]} />
        <meshStandardMaterial color={woodColor} />
      </mesh>
    );

    group.push(
      <mesh
        key="rightPanel"
        position={[width / 2, totalHeight / 2 - 0.4, 0]}
      >
        <boxGeometry args={[shelfDepth, totalHeight, width]} />
        <meshStandardMaterial color={woodColor} />
      </mesh>
    );

    // Shelves
    for (let i = 0; i < shelves; i++) {
      const yPos = i * 0.8;

      // Top shelf
      group.push(
        <mesh
          key={`shelf-top-${i}`}
          position={[0, yPos, -width / 2 + shelfDepth]}
        >
          <boxGeometry args={[width, shelfHeight, shelfDepth]} />
          <meshStandardMaterial color={woodColor} />
        </mesh>
      );

      // Bottom shelf
      group.push(
        <mesh
          key={`shelf-bottom-${i}`}
          position={[0, yPos - shelfHeight, -width / 2 + shelfDepth]}
        >
          <boxGeometry args={[width, shelfHeight, shelfDepth]} />
          <meshStandardMaterial color={woodColor} />
        </mesh>
      );
    }

    // Add books if filled
    if (filled) {
      for (let i = 0; i < shelves; i++) {
        const shelfY = i * 0.8 - shelfHeight / 2;
        const booksPerShelf = Math.floor(Math.random() * 4) + 3;

        for (let j = 0; j < booksPerShelf; j++) {
          const bookWidth = 0.05 + Math.random() * 0.1;
          const bookHeight = 0.1 + Math.random() * 0.4;
          const bookDepth = 0.05 + Math.random() * 0.1;

          const xPos = -width / 2 + 0.1 + (j * bookWidth * 1.2);
          const leanAngle = (Math.random() - 0.5) * 0.1;

          group.push(
            <mesh
              key={`book-${i}-${j}`}
              position={[xPos, shelfY, -0.05]}
              rotation={[0, leanAngle, 0]}
            >
              <boxGeometry args={[bookWidth, bookHeight, bookDepth]} />
              <meshStandardMaterial
                color={bookColors[Math.floor(Math.random() * bookColors.length)]}
              />
            </mesh>
          );
        }
      }
    }

    return group;
  }, [shelves, width, woodColor, filled]);

  return (
    <group position={position} rotation={rotation}>
      {shelfGroup}
    </group>
  );
};

export default Bookshelf;
