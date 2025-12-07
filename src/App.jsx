import { Canvas } from '@react-three/fiber'
import { OrthographicCamera, Environment, SoftShadows } from '@react-three/drei'
import './App.css'

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
