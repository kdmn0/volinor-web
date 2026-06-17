/**
 * BeeController.jsx
 * Kamera kontrollerini (OrbitControls) ve modelin genel hareket durumlarını denetler.
 * Özellikle kameranın model etrafındaki otomatik dönüşünü (autoRotate) ayarlar.
 */
import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { useConfigStore } from "../../store/useConfigStore";
import gsap from "gsap";

export const BeeController = ({ controlsRef }) => {
  const { camera } = useThree();
  const selectedPart = useConfigStore((state) => state.selectedPart);
  const prevPartRef = useRef(null);

  useEffect(() => {
    if (!controlsRef.current) return;

    if (selectedPart === "subtitle2" || selectedPart === "subtitle4") {
      controlsRef.current.autoRotate = false;
    } else {
      controlsRef.current.autoRotate = true;
    }

    if (selectedPart === "subtitle2" || selectedPart === "subtitle4") {
      gsap.killTweensOf(camera.position);
      gsap.killTweensOf(controlsRef.current.target);
      gsap.to(camera.position, {
        x: 0,
        y: 1.0,
        z: -3.2,
        duration: 1.6,
        ease: "power2.inOut",
        onUpdate: () => controlsRef.current?.update(),
      });
      gsap.to(controlsRef.current.target, {
        x: 0,
        y: 0.3,
        z: 0,
        duration: 1.6,
        ease: "power2.inOut",
        onUpdate: () => controlsRef.current?.update(),
      });
    } else if (prevPartRef.current === "subtitle2" || prevPartRef.current === "subtitle4") {
      gsap.killTweensOf(camera.position);
      gsap.killTweensOf(controlsRef.current.target);
      gsap.to(camera.position, {
        x: 1.5,
        y: 0.4,
        z: 2.0,
        duration: 1.6,
        ease: "power2.inOut",
        onUpdate: () => controlsRef.current?.update(),
      });
      gsap.to(controlsRef.current.target, {
        x: 0,
        y: 0.3,
        z: 0,
        duration: 1.6,
        ease: "power2.inOut",
        onUpdate: () => controlsRef.current?.update(),
      });
    }

    prevPartRef.current = selectedPart;
  }, [selectedPart, camera, controlsRef]);

  return null;
};
