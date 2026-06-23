import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useConfigStore } from '../store/useConfigStore';

export function SimulationObstacles({ showHUD = false }) {
  const obstacleRefs = useRef([]);
  const setDodgeTargetX = useConfigStore((state) => state.setDodgeTargetX);
  const setDodgeTargetY = useConfigStore((state) => state.setDodgeTargetY);
  // Clean up global state when component unmounts
  useEffect(() => {
    return () => {
      setDodgeTargetX(0);
      setDodgeTargetY(0);
    };
  }, [setDodgeTargetX, setDodgeTargetY]);

  const obstaclesData = useMemo(() => [
    { id: 0, x: 0.6, y: 0, z: 20, type: 'vertical', isThreat: true },
    { id: 1, x: -2.5, y: 0, z: 50, type: 'vertical', isThreat: false },
    { id: 2, x: 0, y: -0.6, z: 80, type: 'horizontal', isThreat: true },
  ], []);

  const textRefs = useRef([]);
  const bboxMatRefs = useRef([]);

  useFrame((state, delta) => {
    const speed = 15; // Duvarların geliş hızı artırıldı
    let closestX = 0;
    let closestY = 0;
    let minZ = Infinity;

    obstacleRefs.current.forEach((mesh) => {
      if (!mesh) return;
      
      // Duvar kameraya/modele doğru (ters yönden) hareket ediyor (Z azalıyor)
      mesh.position.z -= speed * delta;

      // --- Silinerek Belirme ve Kaybolma (Fade) ---
      const maxOpacity = 0.2; // Materyalin orijinal opaklığı
      if (mesh.position.z > 60) {
        // En uzakta doğarken yavaşça belirsin (Z: 80'den 60'a doğru)
        const progress = (80 - mesh.position.z) / 20;
        mesh.material.opacity = maxOpacity * Math.max(0, Math.min(1, progress));
      } else if (mesh.position.z < 1) {
        // Arıyı ve kamerayı geçerken yavaşça silinsin (Z: 1'den -5'e doğru)
        const progress = (mesh.position.z + 5) / 6;
        mesh.material.opacity = maxOpacity * Math.max(0, Math.min(1, progress));
      } else {
        // Ara bölgede tam görünür
        mesh.material.opacity = maxOpacity;
      }

      // Sütun kameranın/modelin arkasında tamamen kaybolduğunda başa sar
      if (mesh.position.z < -10) {
        mesh.position.z += 90; // 3 engel * 30 aralık = 90 birim ileriye at
        
        // %30 ihtimalle yatay engel olsun
        const isHorizontal = Math.random() > 0.7;
        const isThreat = Math.random() > 0.4; // %60 tehdit (yakın), %40 güvenli (uzak)
        mesh.userData.isThreat = isThreat;
        
        if (isHorizontal) {
          mesh.userData.type = 'horizontal';
          mesh.position.x = 0;
          mesh.position.y = isThreat ? -0.6 : -2.5; // Tehdit değilse çok aşağıda
          mesh.rotation.z = Math.PI / 2; // Yatay çevir
        } else {
          mesh.userData.type = 'vertical';
          mesh.position.x = isThreat 
            ? (Math.random() > 0.5 ? 0.6 : -0.6) 
            : (Math.random() > 0.5 ? 2.5 : -2.5); // Tehdit değilse çok sağda/solda
          mesh.position.y = 0;
          mesh.rotation.z = 0;
        }
      }

      // Sütun arıya yaklaştı mı? (Tehlike alanı) - Sadece tehditse kaç
      if (mesh.userData.isThreat && mesh.position.z < 6 && mesh.position.z > -2) {
        if (mesh.position.z < minZ) {
          minZ = mesh.position.z;
          closestX = mesh.userData.type === 'vertical' ? mesh.position.x : 0;
          closestY = mesh.userData.type === 'horizontal' ? mesh.position.y : 0;
        }
      }

      // HUD Text Güncellemesi
      if (showHUD && textRefs.current[mesh.userData.id]) {
        const dist = Math.max(0, mesh.position.z).toFixed(1);
        const isThreat = mesh.userData.isThreat;
        
        // Mesafe tabanlı görünürlük (Yaklaşınca ortaya çıksın)
        let hudOpacity = 1;
        let hudScale = 1;
        let bboxOpacity = 0.5;

        if (mesh.position.z > 40) {
          hudOpacity = 0;
          hudScale = 0.5;
          bboxOpacity = 0;
        } else if (mesh.position.z <= 40 && mesh.position.z > 30) {
          const progress = (40 - mesh.position.z) / 10;
          hudOpacity = progress;
          hudScale = 0.5 + progress * 0.5;
          bboxOpacity = progress * 0.5;
        } else if (mesh.position.z < 1) {
          // Modelin arkasında yavaşça silinsin (Mesh ile aynı anda)
          const progress = (mesh.position.z + 5) / 6;
          const fadeOut = Math.max(0, Math.min(1, progress));
          hudOpacity = fadeOut;
          bboxOpacity = fadeOut * 0.5;
        }

        const el = textRefs.current[mesh.userData.id];
        el.style.opacity = hudOpacity.toString();
        el.style.transform = `scale(${hudScale})`;
        
        if (isThreat) {
          el.innerText = `TEHDİT [ENGEL]\nUZAKLIK: ${dist}m`;
          const color = dist < 10 ? '#ff0044' : '#ff9900';
          el.style.color = color;
          el.style.borderColor = color;
          if (bboxMatRefs.current[mesh.userData.id]) {
            bboxMatRefs.current[mesh.userData.id].color.set(color);
            bboxMatRefs.current[mesh.userData.id].opacity = bboxOpacity;
          }
        } else {
          el.innerText = `GÜVENLİ [PAS GEÇ]\nUZAKLIK: ${dist}m`;
          el.style.color = '#00ffaa';
          el.style.borderColor = '#00ffaa';
          if (bboxMatRefs.current[mesh.userData.id]) {
            bboxMatRefs.current[mesh.userData.id].color.set('#00ffaa');
            bboxMatRefs.current[mesh.userData.id].opacity = bboxOpacity;
          }
        }
      }
    });

    // Update global state
    setDodgeTargetX(closestX);
    setDodgeTargetY(closestY);
  });

  return (
    <group position={[0, 0.3, 0]}>
      {obstaclesData.map((data, i) => (
        <mesh
          key={data.id}
          ref={(el) => {
            if (el) {
              obstacleRefs.current[i] = el;
              el.userData.type = data.type;
              el.userData.id = data.id;
              el.userData.isThreat = data.isThreat;
            }
          }}
          position={[data.x, data.y || 0, data.z]}
          rotation={[0, 0, data.type === 'horizontal' ? Math.PI / 2 : 0]}
        >
          {/* Sütun (Cylinder) geometrisi */}
          <cylinderGeometry args={[0.15, 0.15, 4, 16]} />
          {/* Temaya uygun yüksek teknolojili, şeffaf, parlayan materyal */}
          <meshStandardMaterial 
            color="#ffb800" 
            emissive="#ffb800" 
            emissiveIntensity={0.4} 
            transparent={true}
            opacity={0.2}
            wireframe={true}
          />

          {showHUD && (
            <>
              {/* Bounding Box Görseli */}
              <mesh>
                <boxGeometry args={[0.4, 4.1, 0.4]} />
                <meshBasicMaterial 
                  ref={(el) => (bboxMatRefs.current[data.id] = el)} 
                  wireframe={true} 
                  transparent 
                  opacity={0.5} 
                />
              </mesh>
              {/* HTML HUD Metni */}
              <Html
                position={[0.3, 0, 0]}
                center
                distanceFactor={10}
                zIndexRange={[100, 0]}
              >
                <div
                  ref={(el) => (textRefs.current[data.id] = el)}
                  className="font-mono text-[7px] bg-black/60 border border-[#ffb800] text-[#ffb800] px-1.5 py-1 whitespace-nowrap tracking-wider backdrop-blur-sm transition-colors duration-200 rounded-sm"
                  style={{
                    boxShadow: '0 0 10px rgba(255, 184, 0, 0.2)',
                  }}
                >
                  ENGEL [98%]<br/>UZAKLIK: --m
                </div>
              </Html>
            </>
          )}
        </mesh>
      ))}
    </group>
  );
}
