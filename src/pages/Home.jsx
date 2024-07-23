import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  Html,
  OrbitControls,
  useGLTF,
  useProgress,
} from "@react-three/drei";
import { useRef, Suspense, useState, useEffect } from "react";

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div style={{ color: "black" }}>Loading ...</div>
    </Html>
  );
}

function easeOutQuad(t) {
  return t * (2 - t);
}

function RotatingModel() {
  const { scene } = useGLTF("/scene.glb");
  const modelRef = useRef();
  const [rotationSpeed, setRotationSpeed] = useState(1);
  const [elapsedTime, setElapsedTime] = useState(0);

  useFrame((state, delta) => {
    if (modelRef.current) {
      if (elapsedTime < 2) {
        setElapsedTime((prev) => prev + delta);
        const progress = easeOutQuad(elapsedTime / 2);
        setRotationSpeed(1 - progress * (1 - 0.001));
      } else {
        setRotationSpeed(0.001);
      }
      modelRef.current.rotation.y += rotationSpeed;
    }
  });

  return <primitive ref={modelRef} object={scene} castShadow />;
}

export default function Home() {
  return (
    <>
      <Canvas
        camera={{ position: [-30, 500, -500], fov: 25, zoom: 30 }}
        style={{ height: "100vh", width: "100vw" }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight
          castShadow
          position={[10, 10, 10]}
          intensity={1}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        <OrbitControls enablePan={false} enableZoom={false} />
        <Suspense fallback={<Loader />}>
          <RotatingModel />
        </Suspense>
        <Environment preset="city" />
      </Canvas>
    </>
  );
}
