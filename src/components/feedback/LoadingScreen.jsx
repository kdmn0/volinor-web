/**
 * LoadingScreen.jsx
 * Sayfa ilk açıldığında 3D modellerin ve asetlerin indirilmesini beklerken
 * gösterilen animasyonlu yükleme (loading) ekranıdır.
 */
import { useProgress } from "@react-three/drei";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useRef } from "react";
import { useConfigStore } from "../../store/useConfigStore";
import MagicRings from "../effects/MagicRings";

export const LoadingScreen = () => {
  const { active } = useProgress();
  const [show, setShow] = useState(true);
  const [minTimePassed, setMinTimePassed] = useState(false);
  const startTimeRef = useRef(Date.now());
  const rafRef = useRef(null);
  const percentRef = useRef(null);
  const progressRef = useRef(0);

  // Minimum bekleme süresi (2.5 saniye)
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimePassed(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // Yumuşak ilerleme animasyonu — doğrudan DOM güncellemesi yapılır (React re-render tetiklemez)
  useEffect(() => {
    const duration = 2500;

    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const value = eased * 99;
      progressRef.current = value;

      if (percentRef.current) {
        percentRef.current.textContent = `${Math.floor(value)}%`;
      }

      if (t < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Hem süre dolmuş hem de model yüklenmişse kapat
  useEffect(() => {
    if (!active && minTimePassed) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (percentRef.current) {
        percentRef.current.textContent = "100%";
      }
      const timer = setTimeout(() => {
        setShow(false);
        useConfigStore.getState().setLoadingDone(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [active, minTimePassed]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.8, ease: "easeInOut" },
          }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            backgroundColor: "#070d1a",
            backgroundImage: `radial-gradient(ellipse 80% 60% at 50% 50%, rgba(13, 31, 60, 0.9) 0%, rgba(3, 8, 16, 0) 70%)`,
          }}>
          {/* MagicRings arka plan efekti */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 0,
            }}>
            <MagicRings
              color="#00e5ff"
              colorTwo="#0088cc"
              ringCount={6}
              speed={0.8}
              attenuation={12}
              lineThickness={1.5}
              baseRadius={0.4}
              radiusStep={0.08}
              scaleRate={0.08}
              opacity={0.6}
              blur={1}
              noiseAmount={0.05}
              rotation={0}
              ringGap={1.5}
              fadeIn={0.7}
              fadeOut={0.5}
              followMouse={false}
              mouseInfluence={0}
              hoverScale={1}
              parallax={0}
              clickBurst={false}
            />
          </div>

          {/* Ortalanmış metin ve yüzde göstergesi */}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
            }}>
            <h1
              style={{
                fontSize: "1.25rem",
                fontWeight: 300,
                letterSpacing: "0.5em",
                color: "rgba(255,255,255,0.9)",
                margin: 0,
              }}>
              <img
                src="/logo_yazı.png"
                alt="Volinor Logo"
                className="h-20 w-auto shrink-0 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
              />
            </h1>
            <span
              ref={percentRef}
              style={{
                marginTop: 4,
                fontSize: 11,
                fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: "0.2em",
                color: "rgba(255,255,255,0.5)",
              }}>
              0%
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
