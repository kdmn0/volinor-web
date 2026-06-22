/**
 * CircularMenu.jsx
 * Ekranın sol tarafında yer alan dairesel tasarımlı seçim menüsüdür.
 * 3D model üzerindeki parçaların (Modelleme, Simülasyon vb.) seçilmesini
 * ve bu seçimlerin global state'e (store) gönderilmesini sağlar.
 */
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Referans masaüstü çözünürlüğü (bu boyutta ölçek = 1.0 olur)
const BASE_WIDTH = 1920;
const BASE_HEIGHT = 1080;

// Menünün aşırı küçülüp büyümesini engelleyen sınırlar
const MIN_SCALE = 0.88;
const MAX_SCALE = 1.35;
const MOBILE_BREAKPOINT = 768;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export const CircularMenu = ({
  isNavOpen,
  setIsNavOpen,
  menuItems,
  selectedPart,
  setSelectedPart,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = useState(false);
  const [viewport, setViewport] = useState({
    width: BASE_WIDTH,
    height: BASE_HEIGHT,
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setIsMobile(width < MOBILE_BREAKPOINT);
      setViewport({ width, height });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Hem genişliğe hem yüksekliğe göre ölçekle; KÜÇÜK olan oranı baz al ki
  // hiçbir kenardan taşma olmasın. Ardından makul sınırlar içine sıkıştır.
  const rawScale = Math.min(
    viewport.width / BASE_WIDTH,
    viewport.height / BASE_HEIGHT,
  );

  // 16:10 ekran algılaması (Örn: 2560x1600 veya 1440x900 -> oran 1.6)
  const aspectRatio = viewport.width / viewport.height;
  const is16by10 = aspectRatio >= 1.55 && aspectRatio <= 1.65;
  
  // 16:10 ekranlar için ölçeği %15 artır
  const scaleMultiplier = is16by10 ? 1.15 : 1.0;

  const sm = clamp(rawScale * scaleMultiplier, MIN_SCALE, MAX_SCALE * scaleMultiplier);

  const startAngle = -25;
  const endAngle = 25;

  const radius = 400 * sm;
  const circleSize = 800 * sm;
  const leftOffset = -550 * sm;

  // Font boyutu layout kadar hızlı küçülmez: 1'den sapma yarı hızda uygulanır.
  // sm=0.88 → fontSm=0.94, sm=1.0 → fontSm=1.0, sm=1.35 → fontSm=1.175
  const fontSm = 1 + (sm - 1) * 0.5;

  // Masaüstü öğe boyutları — CSS scale() kullanılmaz, gerçek piksel değerleri hesaplanır.
  // Math.max() ile her boyuta katı bir taban sınır eklendi; hizalama bozulmaz.
  const nodeSize    = Math.max(36, Math.round(40  * sm));
  const dotLg       = Math.max(10, Math.round(12  * sm));
  const dotSm       = Math.max(5,  Math.round(6   * sm));
  const textW       = Math.max(118, Math.round(136 * sm));
  const textMR      = Math.max(12,  Math.round(16  * sm));
  const labelPx     = Math.max(13,  Math.round(16  * fontSm));
  const subPx       = Math.max(10,  Math.round(12  * fontSm));
  const menuLabelPx = Math.max(12,  Math.round(14  * fontSm));
  const activeLineH = Math.max(60,  Math.round(80  * sm));
  const hoverLineH  = Math.max(36,  Math.round(48  * sm));
  const vertLineH   = Math.max(48,  Math.round(64  * sm));

  const [isPartsOpen, setIsPartsOpen] = useState(false);

  return (
    <>
      {/* Masaüstü Dairesel Menü Arka Plan Çizgisi */}
      {!isMobile && (
        <div
          className={`absolute top-1/2 -translate-y-1/2 pointer-events-none z-10 transition-opacity duration-500 ${isNavOpen ? "opacity-20" : "opacity-100"}`}
          style={{ left: `${leftOffset}px`, width: `${circleSize}px`, height: `${circleSize}px` }}>
          <div className="w-full h-full rounded-full border-[1px] border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.02)]" />
        </div>
      )}

      {/* Mobil Parça Menüsü Açma/Kapama Butonu */}
      <AnimatePresence>
        {isMobile && !isNavOpen && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-30 pointer-events-auto">
            <div
              className="flex items-center justify-center w-8 h-16 bg-black/60 backdrop-blur-md border border-white/10 border-l-0 rounded-r-xl cursor-pointer shadow-[0_0_15px_rgba(0,0,0,0.5)]"
              onClick={() => setIsPartsOpen(!isPartsOpen)}>
              <div className="flex flex-col gap-1 items-center justify-center">
                <div className={`w-[2px] h-3 bg-white/70 rounded-full transition-transform duration-300 origin-bottom ${isPartsOpen ? "-rotate-45" : "rotate-45"}`} />
                <div className={`w-[2px] h-3 bg-white/70 rounded-full transition-transform duration-300 origin-top ${isPartsOpen ? "rotate-45" : "-rotate-45"}`} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Menü Elemanları */}
      <AnimatePresence>
        {!isNavOpen && (!isMobile || isPartsOpen) && (
          <motion.div
            initial={isMobile ? { opacity: 0, x: -50 } : { opacity: 0, scale: 0.95 }}
            animate={isMobile ? { opacity: 1, x: 0 } : { opacity: 1, scale: 1 }}
            exit={isMobile ? { opacity: 0, x: -50 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={
              isMobile
                ? "absolute left-10 top-1/2 -translate-y-1/2 z-20 pointer-events-auto flex flex-col gap-8 pl-2"
                : "absolute top-1/2 -translate-y-1/2 z-20 pointer-events-none"
            }
            style={
              isMobile
                ? {}
                : { left: `${leftOffset}px`, width: `${circleSize}px`, height: `${circleSize}px` }
            }>

            {/* Mobilde Menü Öğelerini Bağlayan İnce Timeline Çizgisi */}
            {isMobile && (
              <div className="absolute left-[30px] top-4 bottom-4 w-[1px] bg-white/10 z-0" />
            )}

            {menuItems.map((item, index) => {
              const isSelected = selectedPart === item.id;

              if (isMobile) {
                // MOBİL TASARIM (Timeline / Stepper Görünümü)
                return (
                  <div
                    key={item.id}
                    className="relative flex items-center cursor-pointer group min-h-[44px] z-10"
                    onClick={() => {
                      if (isSelected) {
                        navigate("/");
                      } else {
                        navigate(item.url);
                      }
                      setSelectedPart(isSelected ? null : item.id);
                      if (!isSelected) setIsPartsOpen(false);
                    }}>

                    {/* Düğüm (Node) */}
                    <div className="relative flex items-center justify-center min-w-[44px] min-h-[44px]">
                      <div
                        className={`absolute w-[2px] h-14 bg-gradient-to-b from-transparent via-[#00e5ff] to-transparent transition-opacity duration-300 ${isSelected ? "opacity-100 shadow-[0_0_10px_#00e5ff]" : "opacity-0"}`}
                      />
                      <div
                        className={`w-10 h-10 rounded-full border-[1px] transition-all duration-300 bg-[#070d1a] ${isSelected ? "border-[#00e5ff] shadow-[0_0_15px_rgba(0,229,255,0.3)] scale-110" : "border-white/20 group-hover:border-white/50 scale-90"}`}
                      />
                      <div
                        className={`absolute rounded-full transition-all duration-300 ${isSelected ? "w-3 h-3 bg-white shadow-[0_0_15px_#00e5ff,0_0_30px_#00e5ff]" : "w-1.5 h-1.5 bg-white/60 group-hover:bg-white/90 group-hover:shadow-[0_0_10px_rgba(255,255,255,0.5)]"}`}
                      />
                    </div>

                    {/* Metinler (Sağ Tarafta) */}
                    <div className="flex flex-col items-start ml-4 whitespace-nowrap bg-black/40 backdrop-blur-sm p-2 rounded-lg border border-white/5">
                      <div
                        className={`font-display text-sm font-semibold tracking-[0.2em] transition-all duration-300 ${isSelected ? "text-[#00e5ff] drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]" : "text-white/70 group-hover:text-white"}`}>
                        {item.label}
                      </div>
                      <div
                        className={`font-sans text-[9px] font-medium tracking-[0.12em] mt-1 transition-all duration-300 ${isSelected ? "text-white/70" : "text-white/40 group-hover:text-white/60"}`}>
                        {item.subLabel}
                      </div>
                    </div>
                  </div>
                );
              }

              // MASAÜSTÜ TASARIM (Dairesel)
              const totalItems = menuItems.length;
              const angleDeg = startAngle + (endAngle - startAngle) * (index / (totalItems - 1));
              const angleRad = (angleDeg * Math.PI) / 180;
              const centerOffset = circleSize / 2;
              const x = centerOffset + radius * Math.cos(angleRad);
              const y = centerOffset + radius * Math.sin(angleRad);

              return (
                <div
                  key={item.id}
                  className="absolute flex items-center pointer-events-auto cursor-pointer group"
                  style={{
                    left: `${x}px`,
                    top: `${y}px`,
                    // CSS scale() KULLANILMAZ — tüm boyutlar zaten sm ile ölçeklenmiş inline style ile verilir.
                    // scale() kullanmak translate(-100%) hesabını bozar ve çifte ölçeklemeye yol açar.
                    transform: "translate(-100%, -50%)",
                    minHeight: "44px",
                  }}
                  onClick={() => {
                    if (isSelected) {
                      navigate("/");
                    } else {
                      navigate(item.url);
                    }
                    setSelectedPart(isSelected ? null : item.id);
                  }}>

                  {/* Sol Aktif Çizgi */}
                  <div
                    className="absolute -left-4 top-1/2 -translate-y-1/2 flex items-center justify-center"
                    style={{ height: `${activeLineH}px` }}>
                    <div
                      className={`w-[3px] rounded-full transition-all duration-300 ${
                        isSelected
                          ? "bg-[#00e5ff] shadow-[0_0_15px_#00e5ff]"
                          : "h-0 bg-[#00e5ff]/50 group-hover:bg-[#00e5ff] group-hover:shadow-[0_0_10px_#00e5ff]"
                      }`}
                      style={
                        isSelected
                          ? { height: `${activeLineH}px` }
                          : { "--hover-h": `${hoverLineH}px` }
                      }
                    />
                  </div>

                  {/* Etiket */}
                  <div
                    className="flex flex-col items-start"
                    style={{ width: `${textW}px`, marginRight: `${textMR}px` }}>
                    <div
                      className={`font-display font-semibold tracking-[0.2em] transition-all duration-300 whitespace-nowrap ${
                        isSelected
                          ? "text-[#00e5ff] drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]"
                          : "text-white/70 group-hover:text-white"
                      }`}
                      style={{ fontSize: `${labelPx}px` }}>
                      {item.label}
                    </div>
                    <div
                      className={`font-sans font-medium tracking-[0.12em] mt-1 transition-all duration-300 ${
                        isSelected ? "text-white/70" : "text-white/40 group-hover:text-white/60"
                      }`}
                      style={{ fontSize: `${subPx}px` }}>
                      {item.subLabel}
                    </div>
                  </div>

                  {/* Düğüm (Node) */}
                  <div
                    className="relative flex items-center justify-center translate-x-1/2"
                    style={{
                      width: `${nodeSize}px`,
                      height: `${nodeSize}px`,
                    }}>
                    <div
                      className={`absolute w-[2px] bg-gradient-to-b from-transparent via-[#00e5ff] to-transparent transition-opacity duration-300 ${isSelected ? "opacity-100 shadow-[0_0_10px_#00e5ff]" : "opacity-0"}`}
                      style={{ height: `${vertLineH}px` }}
                    />
                    <div
                      className={`rounded-full border-[1px] transition-all duration-300 bg-[#070d1a] ${
                        isSelected
                          ? "border-[#00e5ff] bg-[#00e5ff]/10 shadow-[0_0_15px_rgba(0,229,255,0.3)] scale-110"
                          : "border-white/20 group-hover:border-white/50 group-hover:bg-white/5 scale-90"
                      }`}
                      style={{ width: `${nodeSize}px`, height: `${nodeSize}px` }}
                    />
                    <div
                      className={`absolute rounded-full transition-all duration-300 ${
                        isSelected
                          ? "bg-white shadow-[0_0_15px_#00e5ff,0_0_30px_#00e5ff]"
                          : "bg-white/60 group-hover:bg-white/90 group-hover:shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                      }`}
                      style={{
                        width: `${isSelected ? dotLg : dotSm}px`,
                        height: `${isSelected ? dotLg : dotSm}px`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Menü Açma/Kapama Butonu */}
      <div
        className="absolute z-50 pointer-events-auto cursor-pointer flex flex-col justify-center items-center gap-[6px] group min-w-[44px] min-h-[44px] transition-all duration-500 ease-out"
        style={
          isMobile
            ? { right: "1rem", top: "1rem" }
            : {
                left: `${250 * sm}px`,
                top: "50%",
                transform: "translate(-50%, -50%)",
              }
        }
        onClick={() => setIsNavOpen(!isNavOpen)}>
        <div className={`w-6 h-[1px] bg-white transition-all duration-300 origin-center ${isNavOpen ? "rotate-45 translate-y-[7px]" : "group-hover:w-8 group-hover:bg-white"}`} />
        <div className={`w-6 h-[1px] bg-white transition-all duration-300 ${isNavOpen ? "opacity-0" : "group-hover:w-5 group-hover:bg-white"}`} />
        <div className={`w-6 h-[1px] bg-white transition-all duration-300 origin-center ${isNavOpen ? "-rotate-45 -translate-y-[7px]" : "group-hover:w-8 group-hover:bg-white"}`} />
        <div
          className={`font-display absolute left-full ml-2 whitespace-nowrap font-semibold tracking-[0.35em] transition-all duration-300 ${isNavOpen ? "text-white/0 translate-x-2" : "text-white/50 group-hover:text-white translate-x-0"}`}
          style={{ fontSize: `${menuLabelPx}px` }}>
          {t('ui.menu')}
        </div>
      </div>
    </>
  );
};
