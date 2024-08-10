import { Canvas, useLoader } from '@react-three/fiber'
import { RGBELoader } from 'three-stdlib'

import './App.css'
import { useControls } from 'leva'
import {
  Center,
  Environment,
  Instance,
  Instances,
  Lightformer,
  MeshTransmissionMaterial,
  OrbitControls,
  Text3D,
} from '@react-three/drei'

const Grid = ({ number = 23, lineWidth = 0.026, height = 0.5 }) => (
  // Renders a grid and crosses as instances
  <Instances position={[0, 0.02, 0]}>
    <planeGeometry args={[lineWidth, height]} />
    <meshBasicMaterial color='#999' />
    {Array.from({ length: number }, (_, y) =>
      Array.from({ length: number }, (_, x) => (
        <group
          key={x + ':' + y}
          position={[
            x * 2 - Math.floor(number / 2) * 2,
            -0.01,
            y * 2 - Math.floor(number / 2) * 2,
          ]}>
          <Instance rotation={[-Math.PI / 2, 0, 0]} />
          <Instance rotation={[-Math.PI / 2, 0, Math.PI / 2]} />
        </group>
      ))
    )}
    <gridHelper args={[100, 100, '#bbb', '#bbb']} position={[0, -0.01, 0]} />
  </Instances>
)

function App() {
  const { autoRotate, text, ...config } = useControls({
    text: 'OneKey',
    backside: false,
    backsideThickness: { value: 0.3, min: 0, max: 2 },
    samples: { value: 16, min: 1, max: 32, step: 1 },
    resolution: { value: 1024, min: 64, max: 2048, step: 64 },
    transmission: { value: 1, min: 0, max: 1 },
    clearcoat: { value: 0, min: 0.1, max: 1 },
    clearcoatRoughness: { value: 0.0, min: 0, max: 1 },
    thickness: { value: 0.3, min: 0, max: 5 },
    chromaticAberration: { value: 5, min: 0, max: 5 },
    anisotropy: { value: 0.3, min: 0, max: 1, step: 0.01 },
    roughness: { value: 0.2, min: 0, max: 1, step: 0.1 },
    distortion: { value: 0.5, min: 0, max: 4, step: 0.01 },
    distortionScale: { value: 0.1, min: 0.01, max: 1, step: 0.01 },
    temporalDistortion: { value: 0, min: 0, max: 1, step: 0.01 },
    ior: { value: 1.5, min: 0, max: 2, step: 0.01 },
    color: '#45E555',
    gColor: '#92BAA3',
    autoRotate: true,
  })

  const texture = useLoader(
    RGBELoader,
    'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/aerodynamics_workshop_1k.hdr'
  )

  return (
    <Canvas
      shadows
      orthographic
      camera={{ position: [20, 110, 50], zoom: 60 }}
      gl={{ preserveDrawingBuffer: true }}>
      <color attach='background' args={['#eeeeee']} />

      <Center scale={[1, 1, 1]} front top {...config}>
        <Text3D
          rotation={[-Math.PI / 2, 0, 0]}
          castShadow
          bevelEnabled
          font={'/inter.json'}
          scale={4}
          letterSpacing={0.0}
          height={0.25}
          bevelSize={0.01}
          bevelSegments={10}
          curveSegments={128}
          bevelThickness={0.01}>
          {text}

          <MeshTransmissionMaterial {...config} background={texture} />
        </Text3D>
      </Center>

      <Grid />

      <OrbitControls
        autoRotate={autoRotate}
        autoRotateSpeed={-0.3}
        zoomSpeed={0.25}
        minZoom={40}
        maxZoom={140}
        enablePan={false}
        dampingFactor={0.05}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 3}
      />

      <Environment resolution={32}>
        <group rotation={[-Math.PI / 4, -0.3, 0]}>
          <Lightformer
            intensity={20}
            rotation-x={Math.PI / 2}
            position={[0, 5, -9]}
            scale={[10, 10, 1]}
          />
          <Lightformer
            intensity={2}
            rotation-y={Math.PI / 2}
            position={[-5, 1, -1]}
            scale={[10, 2, 1]}
          />
          <Lightformer
            intensity={2}
            rotation-y={Math.PI / 2}
            position={[-5, -1, -1]}
            scale={[10, 2, 1]}
          />
          <Lightformer
            intensity={2}
            rotation-y={-Math.PI / 2}
            position={[10, 1, 0]}
            scale={[20, 2, 1]}
          />
          <Lightformer
            type='ring'
            intensity={2}
            rotation-y={Math.PI / 2}
            position={[-0.1, -1, -5]}
            scale={10}
          />
        </group>
      </Environment>
    </Canvas>
  )
}

export default App
