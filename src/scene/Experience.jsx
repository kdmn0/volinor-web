/**
 * Experience.jsx
 * React Three Fiber (R3F) Canvas bileşenini içerir.
 * Tüm 3D sahnelerin (ışıklandırma, çevre, gölgeler, kameralar ve modeller)
 * render edildiği ana 3D motor dosyasıdır.
 */
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  Center,
  ContactShadows,
  Grid,
} from "@react-three/drei";
import { Suspense, useRef } from "react";
import * as THREE from "three";
import { BeeModel } from "./BeeModel";
import { BeeController } from "./BeeController";
import { SimulationObstacles } from "./SimulationObstacles";
import { WindParticles } from "./WindParticles";
import { useConfigStore } from "../store/useConfigStore";

export const Experience = () => {
  const controlsRef = useRef();
  const selectedModel = useConfigStore((state) => state.selectedModel);
  const selectedPart = useConfigStore((state) => state.selectedPart);
  const isLoadingDone = useConfigStore((state) => state.isLoadingDone);

  return (
    <Canvas
      shadows={{ type: THREE.PCFShadowMap }}
      dpr={[1, 1.5]}
      camera={{ position: [1.5, 0.2, 1.5], fov: 45 }}
      className="bg-transparent"
      performance={{ min: 0.5 }}>
      <fog attach="fog" args={["#020202", 12, 45]} />

      <Suspense fallback={null}>
        <Environment preset="studio" environmentIntensity={0.5} />

        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize={512}
        />
        <spotLight
          position={[-5, 5, -5]}
          intensity={2}
          color="#ffffff"
          penumbra={1}
          distance={20}
        />

        <Center position={[0, 0.3, 0]}>
          <group visible={selectedModel === "bee"}>
            <BeeModel scale={0.005} />
          </group>
        </Center>

        {selectedModel === "bee" && (selectedPart === "subtitle2" || selectedPart === "subtitle4") && (
          <>
            <SimulationObstacles showHUD={selectedPart === "subtitle4"} />
            <WindParticles />
          </>
        )}

        <ContactShadows
          position={[0, -0.8, 0]}
          opacity={0.8}
          scale={10}
          blur={2}
          far={4}
          resolution={256}
          color="#000000"
        />

        <OrbitControls
          ref={controlsRef}
          makeDefault
          enablePan={false}
          enableZoom={true}
          minDistance={1}
          maxDistance={4}
          maxPolarAngle={Math.PI}
          autoRotate={true}
          autoRotateSpeed={1}
        />
        {selectedModel === "bee" && <BeeController controlsRef={controlsRef} />}
      </Suspense>
    </Canvas>
  );
};
