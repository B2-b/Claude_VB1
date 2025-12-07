import { Canvas, useThree } from '@react-three/fiber'
import { OrthographicCamera, Environment, SoftShadows, RoundedBox } from '@react-three/drei'
import { useMemo } from 'react'
import './App.css'

// Layout constants (9:16 aspect ratio divided into 16 vertical parts)
const LAYOUT = {
  HEADER_PARTS: 6,    // 6/16 = 37.5% from top
  GAME_ZONE_PARTS: 6, // 6/16 = 37.5% middle section
  FOOTER_PARTS: 4,    // 4/16 = 25% bottom
  TOTAL_PARTS: 16,
  SAFETY_MARGIN: 0.10 // 10% margin around the board
}

// Game board dimensions
const BOARD_SIZE = {
  width: 6.5,
  height: 0.5,
  depth: 6.5
}

function GameBoard({ positionY }) {
  return (
    <group position={[0, positionY, 0]}>
      <RoundedBox
        args={[BOARD_SIZE.width, BOARD_SIZE.height, BOARD_SIZE.depth]}
        radius={0.1}
        smoothness={4}
      >
        <meshPhysicalMaterial
          color="#88ccff"
          transmission={0.9}
          roughness={0}
          thickness={0.5}
          envMapIntensity={1}
          clearcoat={1}
          clearcoatRoughness={0}
        />
      </RoundedBox>
    </group>
  )
}

function CameraController() {
  const { viewport, camera } = useThree()

  // Calculate zoom and board position based on viewport
  const { zoom, boardPositionY } = useMemo(() => {
    // For isometric view, the projected height of the board includes depth perspective
    // The board diagonal in isometric view: sqrt(2) * max(width, depth) for X-Z plane
    // Plus the height contribution
    const isometricAngle = Math.atan(1 / Math.sqrt(2)) // ~35.26 degrees

    // Projected height of the board in isometric view
    const projectedBoardHeight = BOARD_SIZE.height +
      BOARD_SIZE.depth * Math.sin(isometricAngle) * 0.7

    // The board should fit in the Game Zone (6/16 of height) with 10% margin
    const gameZoneFraction = LAYOUT.GAME_ZONE_PARTS / LAYOUT.TOTAL_PARTS
    const availableHeight = viewport.height * gameZoneFraction * (1 - LAYOUT.SAFETY_MARGIN)

    // Calculate zoom so the board fits in the available height
    const calculatedZoom = availableHeight / projectedBoardHeight

    // Ensure minimum zoom for very small viewports
    const finalZoom = Math.max(calculatedZoom, 30)

    // Calculate Y offset to center board in Game Zone
    // Game Zone center is at: header + gameZone/2 = 6/16 + 3/16 = 9/16 = 56.25% from top
    // Screen center is at 50%, so Game Zone center is 6.25% below screen center
    // In viewport coordinates (centered at 0): offset = -viewport.height * 0.0625
    const gameZoneCenterOffset = (LAYOUT.HEADER_PARTS + LAYOUT.GAME_ZONE_PARTS / 2) / LAYOUT.TOTAL_PARTS - 0.5
    const boardOffsetY = -viewport.height * gameZoneCenterOffset / finalZoom * 10

    return { zoom: finalZoom, boardPositionY: boardOffsetY }
  }, [viewport])

  // Update camera zoom
  camera.zoom = zoom
  camera.updateProjectionMatrix()

  return <GameBoard positionY={boardPositionY} />
}

function Scene() {
  return (
    <>
      <OrthographicCamera
        makeDefault
        position={[10, 10, 10]}
        zoom={50}
        near={0.1}
        far={1000}
      />
      <Environment preset="sunset" />
      <SoftShadows size={25} samples={16} focus={0.5} />
      <CameraController />
    </>
  )
}

function App() {
  return (
    <>
      <div className="background" />
      <Canvas shadows className="canvas">
        <Scene />
      </Canvas>
    </>
  )
}

export default App
