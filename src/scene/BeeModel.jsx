/**
 * BeeModel.jsx
 * 3D arı (bee) modelini yükleyen ve sahnede gösteren bileşendir.
 * Model üzerindeki animasyonları (kanat çırpma vb.) ve parçaların görünürlüğünü
 * (X-Ray şeffaflık modu gibi) `useFrame` ile frame (kare) bazlı yönetir.
 */
import { useGLTF } from "@react-three/drei";
import { useConfigStore } from "../store/useConfigStore";
import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function BeeModel(props) {
  const { scene } = useGLTF("/models/bee_compressed.glb");
  const selectedPart = useConfigStore((state) => state.selectedPart);
  const activePage = useConfigStore((state) => state.activePage);
  const body47Refs = useRef([]);
  const body63Refs = useRef([]);
  const groupRef = useRef();

  // Kanat animasyonunun fazı ve hızı için referanslar (kademeli geçiş için)
  const wingPhase = useRef(0);
  const currentWingSpeed = useRef(10);

  // Orijinal materyalleri sakla ve renk ayarlamaları yap
  const originalMaterials = useMemo(() => {
    const materials = {};
    const sharedClones = {}; // Performans için: Aynı materyali tekrar tekrar klonlamak yerine cache'liyoruz

    scene.traverse((child) => {
      if (child.isMesh) {
        const whiteParts = ["Material_25", "Material_21"];
        const grayParts = [
          "Material_0",
          "Material_15",
          "Material_17",
          "Material_18",
          "Material_19",
          "Material_22",
          "Material_26",
          "Material_53",
          "Material_56",
        ];

        let isWing = false;
        let currentParent = child; // Mesh'in kendisini ve üst gruplarını kontrol edelim
        while (currentParent) {
          if (
            currentParent.name &&
            (currentParent.name.includes("Component6(Mirror)") ||
              currentParent.name.includes("Component55"))
          ) {
            isWing = true;
            break;
          }
          currentParent = currentParent.parent;
        }

        const isWhite = whiteParts.some(
          (name) =>
            child.name.includes(name) ||
            (child.material.name && child.material.name.includes(name)),
        );

        const isGray = grayParts.some(
          (name) =>
            child.name.includes(name) ||
            (child.material.name && child.material.name.includes(name)),
        );

        // Her mesh için clone yapmak yerine benzersiz durumlar için bir key oluşturuyoruz:
        const cacheKey = `${child.material.uuid}-${isWhite}-${isGray}-${isWing}`;

        let mat = sharedClones[cacheKey];

        if (!mat) {
          mat = child.material.clone();

          if (isWhite) {
            mat.color.set("#FFFFFF"); // Beyaz
          } else if (isGray) {
            mat.color.set("#A0A0A0"); // Gri
          }

          // Eğer parça kanatsa ve cam materyaline sahipse cam özelliğini kaldırıp katılaştıralım
          if (isWing && mat.name && mat.name.includes("Glass")) {
            mat.transparent = false;
            mat.opacity = 1;
            mat.transmission = 0; // MeshPhysicalMaterial için şeffaflık
            mat.roughness = 0.5;
            mat.metalness = 0.5;
            mat.color.set("#A0A0A0"); // Tamamen renksiz kalmaması için hafif gri yapalım
          }

          sharedClones[cacheKey] = mat;
        }

        materials[child.uuid] = mat;
      }
    });
    return materials;
  }, [scene]);

  // X-Ray materyali (Holografik / Şeffaf / Wireframe karışımı)
  // MeshBasicMaterial kullanarak ışıklandırma hesaplamalarını devre dışı bırakıyoruz (Performans artışı için)
  const xrayMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#ffb800",
        transparent: true,
        opacity: 0.06, // Arka planda belirgin olması için artırıldı ve renk değiştirildi
        wireframe: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [],
  );

  // Referansları sadece model ilk yüklendiğinde bir kez topla
  useLayoutEffect(() => {
    body47Refs.current = [];
    body63Refs.current = [];

    scene.traverse((child) => {
      if (child.isMesh && child.name) {
        if (child.name.includes("Component6(Mirror)")) {
          body47Refs.current.push(child);
        } else if (child.name.includes("Component55")) {
          body63Refs.current.push(child);
        }
      }
    });
  }, [scene]);

  // Seçilen parçaya göre materyalleri güncelle
  useLayoutEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.material =
          selectedPart === "subtitle1"
            ? xrayMaterial
            : originalMaterials[child.uuid];
      }
    });
  }, [selectedPart, scene, originalMaterials, xrayMaterial]);

  // Animasyon döngüsü (Sürekli olarak 60 dereceyi tarar ve simülasyon kaçışlarını yönetir)
  useFrame(({ clock }, delta) => {
    // Performans için bilgi paneli açıkken animasyonu durdur
    if (activePage) return;

    const elapsedTime = clock.getElapsedTime();

    // --- Kanat Çırpma Hızını Kademeli Artırma ---
    const targetWingSpeed =
      selectedPart === "subtitle2" || selectedPart === "subtitle4" ? 80 : 10;
    // Hızı yumuşak bir şekilde (lerp) hedef hıza çekiyoruz
    currentWingSpeed.current = THREE.MathUtils.lerp(
      currentWingSpeed.current,
      targetWingSpeed,
      2 * delta,
    );

    if (selectedPart === "subtitle3") {
      // İleri Malzeme seçildiğinde kanatların en üst konumda durmasını sağla
      // Bunun için kanat fazını (wingPhase) en yakın tepe noktasına (sin = 1) lerpliyoruz
      const PI_2 = Math.PI / 2;
      const TWO_PI = Math.PI * 2;
      const k = Math.round((wingPhase.current - PI_2) / TWO_PI);
      const targetPhase = PI_2 + k * TWO_PI;

      wingPhase.current = THREE.MathUtils.lerp(
        wingPhase.current,
        targetPhase,
        5 * delta,
      );
    } else {
      // Fazı (phase) güncel hız üzerinden biriktiriyoruz (Zaman atlamalarını önlemek için)
      wingPhase.current += currentWingSpeed.current * delta;
    }

    // Toplam 60 derece (Math.PI / 3) taraması
    const swingAngle = Math.sin(wingPhase.current) * (Math.PI / 6);

    // Yeni modeldeki eksene göre kanat salınımı
    body47Refs.current.forEach((child) => {
      child.rotation.y = swingAngle;
    });

    body63Refs.current.forEach((child) => {
      child.rotation.y = -swingAngle;
    });

    // --- Simülasyon: Kaçınma Animasyonu ---
    if (groupRef.current) {
      if (selectedPart === "subtitle2" || selectedPart === "subtitle4") {
        // Simülasyon veya Yapay Zeka aktif, engellerden kaç
        const dodgeX = useConfigStore.getState().dodgeTargetX;
        const dodgeY = useConfigStore.getState().dodgeTargetY;

        let targetX = 0;
        let targetY = 0;
        let targetRotZ = 0;
        let targetRotX = Math.PI / 12; // Varsayılan: ileriye doğru hafifçe öne eğil

        if (dodgeY !== 0) {
          // Yatay engel var, sadece Z ekseni bozulmadan yukarıya doğru yüksel
          targetY = 0.8;
        } else if (dodgeX !== 0) {
          // Dikey engel var, sağa/sola kaç
          targetX = dodgeX > 0.1 ? -0.8 : dodgeX < -0.1 ? 0.8 : 0;
          targetRotZ =
            dodgeX > 0.1 ? Math.PI / 8 : dodgeX < -0.1 ? -Math.PI / 8 : 0;
        }

        // --- Rüzgar Efekti (Hafif Salınım) ---
        targetX += Math.sin(elapsedTime * 2.5) * 0.08;
        targetY += Math.cos(elapsedTime * 2.0) * 0.05;
        targetRotZ += Math.sin(elapsedTime * 1.5) * 0.03;
        targetRotX += Math.cos(elapsedTime * 1.8) * 0.03;

        groupRef.current.position.x = THREE.MathUtils.lerp(
          groupRef.current.position.x,
          targetX,
          5 * delta,
        );
        groupRef.current.position.y = THREE.MathUtils.lerp(
          groupRef.current.position.y,
          targetY,
          5 * delta,
        );
        groupRef.current.rotation.z = THREE.MathUtils.lerp(
          groupRef.current.rotation.z,
          targetRotZ,
          5 * delta,
        );
        groupRef.current.rotation.x = THREE.MathUtils.lerp(
          groupRef.current.rotation.x,
          targetRotX,
          5 * delta,
        );
      } else {
        // Simülasyon aktif değilse merkeze ve düz konuma dön
        groupRef.current.position.x = THREE.MathUtils.lerp(
          groupRef.current.position.x,
          0,
          5 * delta,
        );
        groupRef.current.position.y = THREE.MathUtils.lerp(
          groupRef.current.position.y,
          0,
          5 * delta,
        );
        groupRef.current.rotation.z = THREE.MathUtils.lerp(
          groupRef.current.rotation.z,
          0,
          5 * delta,
        );
        groupRef.current.rotation.x = THREE.MathUtils.lerp(
          groupRef.current.rotation.x,
          0,
          5 * delta,
        );
      }
    }
  });

  return (
    <group ref={groupRef} {...props}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload("/models/bee_compressed.glb");
