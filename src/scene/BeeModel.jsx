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
  const { scene } = useGLTF("/models/bee.glb");
  const selectedPart = useConfigStore((state) => state.selectedPart);
  const activePage = useConfigStore((state) => state.activePage);
  const empty55Refs = useRef([]);
  const empty58Refs = useRef([]);
  const groupRef = useRef();

  // Kanat animasyonunun fazı ve hızı için referanslar (kademeli geçiş için)
  const wingPhase = useRef(0);
  const currentWingSpeed = useRef(10);

  // Orijinal materyalleri sakla ve renk ayarlamaları yap
  const originalMaterials = useMemo(() => {
    const materials = {};
    scene.traverse((child) => {
      if (child.isMesh) {
        // Materyali klonlayarak ayrı bir kopyasını oluşturuyoruz.
        // Böylece varsayılan renklerini serbestçe değiştirebiliriz.
        const mat = child.material.clone();

        // Mesh'in "empty_55" veya "empty_58" grubu altında olup olmadığını kontrol et
        let isGradientTarget = false;
        let currentParent = child.parent;

        while (currentParent) {
          if (
            currentParent.name &&
            (currentParent.name.includes("55") ||
              currentParent.name.includes("58"))
          ) {
            isGradientTarget = true;
            break;
          }
          currentParent = currentParent.parent;
        }

        // Beyaz yapmak istediğiniz materyaller:
        const whiteParts = [
          "Material_25",
          "Material_21"
        ];

        // Gri yapmak istediğiniz parçaların veya materyallerin isimleri:
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

        // Eğer parça (mesh) veya materyal ismi yukarıdaki listelerdeyse onu ilgili renge boya:
        const isWhite = whiteParts.some(
          (name) =>
            child.name.includes(name) || (mat.name && mat.name.includes(name)),
        );

        const isGray = grayParts.some(
          (name) =>
            child.name.includes(name) || (mat.name && mat.name.includes(name)),
        );

        if (isWhite) {
          mat.color.set("#FFFFFF"); // Beyaz
        } else if (isGray) {
          mat.color.set("#A0A0A0"); // Gri (İstediğiniz tonu ayarlayabilirsiniz)
        }
        // --------------------------------------------------------

        // Eğer bu parça empty_55 veya empty_58 altındaysa VE gri/beyaz olarak işaretlenmediyse ona gradyanı uygula
        if (isGradientTarget && !isGray && !isWhite) {
          // Modelin kendi geometrisinin alt ve üst sınırlarını hesapla
          child.geometry.computeBoundingBox();
          const bbox = child.geometry.boundingBox;

          // Çok küçük bir ihtimalle bbox gelmezse varsayılan değer veriyoruz
          const minY = bbox ? bbox.min.y : -1.0;
          const maxY = bbox ? bbox.max.y : 1.0;

          // Materyal render edilmeden hemen önce (shader compile aşamasında) araya giriyoruz
          mat.onBeforeCompile = (shader) => {
            // Uniform değerlerimizi (dışarıdan verdiğimiz değişkenler) ekliyoruz
            shader.uniforms.colorTop = { value: new THREE.Color("#7A00C6") }; // Mor (Üst)
            shader.uniforms.colorBottom = { value: new THREE.Color("#23D5F1") }; // Mavi (Alt)
            shader.uniforms.bboxMin = { value: minY };
            shader.uniforms.bboxMax = { value: maxY };

            // 1. Vertex Shader (Nokta verileri): Pozisyonu fragment shader'a gönder
            shader.vertexShader = `
              varying vec3 vLocalPosition;
              ${shader.vertexShader}
            `.replace(
              `#include <begin_vertex>`,
              `#include <begin_vertex>
               vLocalPosition = position;
              `,
            );

            // 2. Fragment Shader (Piksel verileri): Yüksekliğe göre renkleri karıştır
            shader.fragmentShader = `
              uniform vec3 colorTop;
              uniform vec3 colorBottom;
              uniform float bboxMin;
              uniform float bboxMax;
              varying vec3 vLocalPosition;
              ${shader.fragmentShader}
            `.replace(
              `vec4 diffuseColor = vec4( diffuse, opacity );`,
              `
              // Y koordinatına göre 0.0 (alt) ile 1.0 (üst) arası bir oran (ratio) buluyoruz
              float mixRatio = clamp((vLocalPosition.y - bboxMin) / (bboxMax - bboxMin), 0.0, 1.0);
              
              // Alt renkten üst renge geçiş yap
              vec3 gradientColor = mix(colorBottom, colorTop, mixRatio);
              
              vec4 diffuseColor = vec4( gradientColor, opacity );
              `,
            );
          };
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

  useLayoutEffect(() => {
    empty55Refs.current = []; // Referansları sıfırla
    empty58Refs.current = [];

    scene.traverse((child) => {
      if (child.isMesh) {
        if (selectedPart === "subtitle1") {
          child.material = xrayMaterial;
        } else {
          child.material = originalMaterials[child.uuid];
        }
      }

      // empty_55 ve empty_58 isimli nesneleri bul ve ilgili animasyon dizilerine ekle
      if (child.name && child.name.toLowerCase().includes("empty")) {
        if (child.name.includes("55")) {
          empty55Refs.current.push(child);
        } else if (child.name.includes("58")) {
          empty58Refs.current.push(child);
        }
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

    // empty_55 için salınım
    empty55Refs.current.forEach((child) => {
      child.rotation.z = swingAngle;
    });

    // empty_58 için salınım (Kanat vb. karşılıklı parçalar ise simetrik çalışması için -swingAngle kullanıyoruz)
    empty58Refs.current.forEach((child) => {
      child.rotation.z = -swingAngle;
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

useGLTF.preload("/models/bee.glb");
