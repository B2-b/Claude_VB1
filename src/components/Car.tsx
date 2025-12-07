import { RoundedBox } from '@react-three/drei'
import { useMemo } from 'react'
import * as THREE from 'three'

// Palette de couleurs inspirée de la nature (pour les voitures locales)
const NATURE_COLORS = {
  vertSapin: '#1B4332',    // Vert Sapin profond
  bleuNuit: '#1D3557',     // Bleu Nuit
  ocre: '#BC6C25',         // Ocre terreux
  grisPierre: '#6C757D',   // Gris Pierre
}

// Rouge vif pour le joueur
const PLAYER_COLOR = '#E63946'

// Tableau des couleurs pour les voitures locales
const LOCAL_COLORS = Object.values(NATURE_COLORS)

interface CarProps {
  id: string
  position?: [number, number, number]
  rotation?: [number, number, number]
}

export function Car({ id, position = [0, 0, 0], rotation = [0, 0, 0] }: CarProps) {
  // Détermine si c'est la voiture du joueur
  const isPlayer = id === 'X' || id === 'A'

  // Sélectionne la couleur basée sur l'ID
  const color = useMemo(() => {
    if (isPlayer) {
      return PLAYER_COLOR
    }
    // Hash simple basé sur l'ID pour sélectionner une couleur cohérente
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return LOCAL_COLORS[hash % LOCAL_COLORS.length]
  }, [id, isPlayer])

  // Dimensions de la voiture (style bubble/toy)
  const width = 0.9      // Largeur (pour gap visuel)
  const height = 0.5     // Hauteur du corps
  const depth = 1.6      // Longueur
  const radius = 0.15    // Radius élevé pour l'effet bubble

  // Hauteur du toit
  const roofHeight = 0.35
  const roofWidth = 0.7
  const roofDepth = 0.8
  const roofRadius = 0.12

  // Ajustement du pivot pour que la voiture soit posée sur le plateau
  // Le centre de la RoundedBox est au milieu, donc on décale de height/2
  const baseOffset = height / 2

  return (
    <group
      position={[position[0], position[1] + baseOffset, position[2]]}
      rotation={rotation.map(r => r * Math.PI / 180) as [number, number, number]}
    >
      {/* Corps principal de la voiture */}
      <RoundedBox
        args={[width, height, depth]}
        radius={radius}
        smoothness={4}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color={color}
          roughness={isPlayer ? 0.1 : 0.3}
          metalness={isPlayer ? 0.8 : 0.4}
        />
      </RoundedBox>

      {/* Toit / Cabine (bulle) */}
      <RoundedBox
        args={[roofWidth, roofHeight, roofDepth]}
        radius={roofRadius}
        smoothness={4}
        position={[0, (height + roofHeight) / 2, -0.1]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color={color}
          roughness={isPlayer ? 0.1 : 0.3}
          metalness={isPlayer ? 0.8 : 0.4}
        />
      </RoundedBox>

      {/* Vitres (effet verre teinté) */}
      <RoundedBox
        args={[roofWidth - 0.05, roofHeight - 0.08, roofDepth - 0.05]}
        radius={roofRadius - 0.02}
        smoothness={4}
        position={[0, (height + roofHeight) / 2, -0.1]}
      >
        <meshStandardMaterial
          color="#1a1a2e"
          roughness={0.1}
          metalness={0.9}
          transparent
          opacity={0.7}
        />
      </RoundedBox>

      {/* Roues (4 cylindres aplatis) */}
      {[
        [-width / 2 + 0.05, -height / 2 + 0.08, depth / 3],      // Avant gauche
        [width / 2 - 0.05, -height / 2 + 0.08, depth / 3],       // Avant droite
        [-width / 2 + 0.05, -height / 2 + 0.08, -depth / 3],     // Arrière gauche
        [width / 2 - 0.05, -height / 2 + 0.08, -depth / 3],      // Arrière droite
      ].map((pos, index) => (
        <mesh
          key={index}
          position={pos as [number, number, number]}
          rotation={[0, 0, Math.PI / 2]}
          castShadow
        >
          <cylinderGeometry args={[0.15, 0.15, 0.08, 16]} />
          <meshStandardMaterial
            color="#2d2d2d"
            roughness={0.8}
            metalness={0.2}
          />
        </mesh>
      ))}

      {/* Phares avant */}
      {[
        [-width / 3, 0, depth / 2 - 0.02],
        [width / 3, 0, depth / 2 - 0.02],
      ].map((pos, index) => (
        <mesh key={`headlight-${index}`} position={pos as [number, number, number]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial
            color="#fffde7"
            emissive="#fffde7"
            emissiveIntensity={0.3}
            roughness={0.2}
          />
        </mesh>
      ))}

      {/* Feux arrière */}
      {[
        [-width / 3, 0, -depth / 2 + 0.02],
        [width / 3, 0, -depth / 2 + 0.02],
      ].map((pos, index) => (
        <mesh key={`taillight-${index}`} position={pos as [number, number, number]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial
            color="#ff1744"
            emissive="#ff1744"
            emissiveIntensity={0.2}
            roughness={0.3}
          />
        </mesh>
      ))}
    </group>
  )
}

export default Car
