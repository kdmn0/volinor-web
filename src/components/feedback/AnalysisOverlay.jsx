import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";

const CrosshairIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="14" cy="14" r="5" stroke="#ffb800" strokeWidth="1" opacity="0.8" />
    <line x1="14" y1="2" x2="14" y2="8" stroke="#ffb800" strokeWidth="1" opacity="0.6" />
    <line x1="14" y1="20" x2="14" y2="26" stroke="#ffb800" strokeWidth="1" opacity="0.6" />
    <line x1="2" y1="14" x2="8" y2="14" stroke="#ffb800" strokeWidth="1" opacity="0.6" />
    <line x1="20" y1="14" x2="26" y2="14" stroke="#ffb800" strokeWidth="1" opacity="0.6" />
    <circle cx="14" cy="14" r="1.5" fill="#ffb800" />
  </svg>
);

export const AnalysisOverlay = ({ visible }) => {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (visible) {
      setDismissed(false);
      const t = setTimeout(() => setDismissed(true), 3500);
      return () => clearTimeout(t);
    }
  }, [visible]);

  const show = visible && !dismissed;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="analysis-overlay"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{
            position: "absolute",
            top: "32%",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 25,
            pointerEvents: "none",
            width: "min(420px, 88vw)",
          }}>
          <div
            style={{
              background: "rgba(7, 13, 26, 0.72)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 184, 0, 0.18)",
              borderRadius: "16px",
              padding: "24px 28px 20px",
              boxShadow: "0 0 40px rgba(255, 184, 0, 0.06), inset 0 1px 0 rgba(255, 184, 0,0.08)",
            }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
              <CrosshairIcon />
              <div>
                <div
                  className="font-display font-semibold tracking-[0.2em]"
                  style={{ fontSize: "13px", color: "#ffb800" }}>
                  SİSTEM ANALİZE HAZIRLANIYOR
                </div>
                <div
                  className="font-sans"
                  style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", marginTop: "3px", letterSpacing: "0.06em" }}>
                  STRUCTURAL ANALYSIS MODULE — STANDBY
                </div>
              </div>
            </div>

            <p
              className="font-sans"
              style={{ fontSize: "12px", color: "rgba(255,255,255,0.55)", lineHeight: 1.7, marginBottom: "18px" }}>
              Yeni nesil yapısal model ve analiz verileri bekleniyor. Exploded view modu hazır olduğunda bu alan otomatik olarak aktive edilecektir.
            </p>

            <div style={{ position: "relative", height: "2px", background: "rgba(255, 184, 0,0.06)", borderRadius: "1px", overflow: "hidden" }}>
              <motion.div
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.6 }}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "40%",
                  background: "linear-gradient(90deg, transparent, rgba(255, 184, 0,0.5), transparent)",
                }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
