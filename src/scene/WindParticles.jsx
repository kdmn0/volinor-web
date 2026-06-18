import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useConfigStore } from '../store/useConfigStore';

export function WindParticles({ count = 150 }) {
  const meshRef = useRef();
  const selectedPart = useConfigStore((state) => state.selectedPart);
  
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 15; // X ekseninde yayılım
      const y = (Math.random() - 0.5) * 10; // Y ekseninde yayılım
      const z = Math.random() * 60 - 10; // Başlangıçta -10 ile 50 arasında dağıt
      const speed = 25 + Math.random() * 20; // Engellerden daha hızlı rüzgar çizgileri (25-45)
      const scaleX = 0.005 + Math.random() * 0.01; // İnce çizgiler
      const scaleY = 0.005 + Math.random() * 0.01;
      const scaleZ = 1 + Math.random() * 4; // Z yönünde uzun çizgiler
      temp.push({ x, y, z, speed, scaleX, scaleY, scaleZ });
    }
    return temp;
  }, [count]);

  useFrame((state, delta) => {
    // Sadece Simülasyon ve Yapay Zeka modunda göster
    const isVisible = selectedPart === "subtitle2" || selectedPart === "subtitle4";
    if (!isVisible) {
      if (meshRef.current) meshRef.current.visible = false;
      return;
    } else {
      if (meshRef.current) meshRef.current.visible = true;
    }

    // Yüksek delta değerlerinde ani zıplamayı önle
    const dt = Math.min(delta, 0.1);

    particles.forEach((particle, i) => {
      // Engeller z -= hız şeklinde geldiği için rüzgar çizgileri de aynı yönde, ama daha hızlı gelir
      particle.z -= particle.speed * dt;

      // Kameranın arkasına geçince (negatif z) tekrar uzağa yolla
      if (particle.z < -10) {
        particle.z = 50 + Math.random() * 20; // 50-70 aralığına geri gönder
        particle.x = (Math.random() - 0.5) * 15;
        particle.y = (Math.random() - 0.5) * 10;
      }

      dummy.position.set(particle.x, particle.y, particle.z);
      dummy.scale.set(particle.scaleX, particle.scaleY, particle.scaleZ);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial 
        color="#aaddff" // Hafif mavi/beyaz rüzgar rengi 
        transparent 
        opacity={0.4} 
        depthWrite={false} 
        blending={THREE.AdditiveBlending} 
      />
    </instancedMesh>
  );
}
