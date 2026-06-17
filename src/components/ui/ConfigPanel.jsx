/**
 * ConfigPanel.jsx
 * Ana kullanıcı arayüzü (UI) kapsayıcısıdır. Ekranda görünen tüm düğmeleri, menüleri
 * ve bilgi panellerini (SidebarMenu, CircularMenu, PageModal) bir araya getirerek
 * son kullanıcıya sunar.
 */
import { motion, AnimatePresence } from "motion/react";
import { useConfigStore } from "../../store/useConfigStore";
import { PART_OPTIONS } from "../../data/parts";
import { useState, useMemo } from "react";
import { SidebarMenu } from "./SidebarMenu";
import { CircularMenu } from "./CircularMenu";
import { PageModal } from "./PageModal";
import { useNavigate } from "react-router-dom";

export const ConfigPanel = () => {
  const navigate = useNavigate();
  const [isNavOpen, setIsNavOpen] = useState(() => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      return [
        "/hakkimizda",
        "/urunlerimiz",
        "/sertifika-ve-patentler",
        "/referanslar",
        "/iletisim",
        "/model-kutuphanesi",
        "/video-kutuphanesi",
      ].includes(path);
    }
    return false;
  });

  const selectedPart = useConfigStore((state) => state.selectedPart);
  const setSelectedPart = useConfigStore((state) => state.setSelectedPart);
  const activePage = useConfigStore((state) => state.activePage);
  const setActivePage = useConfigStore((state) => state.setActivePage);
  const selectedModel = useConfigStore((state) => state.selectedModel);
  const showUI = useConfigStore((state) => state.showUI);

  const partData = selectedPart ? PART_OPTIONS[selectedPart] : null;

  const menuItems = useMemo(() => {
    return selectedModel === "bee"
      ? [
          {
            id: "subtitle1",
            url: "/modelleme",
            label: "MODELLEME",
            subLabel: "3D MODEL & TASARIM",
          },
          { id: "subtitle2", url: "/simulasyon", label: "SİMÜLASYON", subLabel: "SENARYO & TEST" },
          {
            id: "subtitle3",
            url: "/ileri-malzeme",
            label: "İLERİ MALZEME",
            subLabel: "KOMPOZİT & ANALİZ",
          },
          {
            id: "subtitle4",
            url: "/yapay-zeka",
            label: "YAPAY ZEKA",
            subLabel: "ALGORİTMA & OTONOMİ",
          },
        ]
      : [
          { id: "subtitle5", url: "/", label: "5", subLabel: "" },
          { id: "subtitle6", url: "/", label: "6", subLabel: "" },
          { id: "subtitle7", url: "/", label: "7", subLabel: "" },
          { id: "subtitle8", url: "/", label: "8", subLabel: "" },
        ];
  }, [selectedModel]);

  return (
    <AnimatePresence>
      {showUI && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute inset-0 pointer-events-none z-10">
          {/* Dairesel Seçim Menüsü */}
          <CircularMenu
            isNavOpen={isNavOpen}
            setIsNavOpen={(val) => {
              setIsNavOpen(val);
              if (!val) {
                navigate("/");
                setActivePage(null);
              }
            }}
            menuItems={menuItems}
            selectedPart={selectedPart}
            setSelectedPart={setSelectedPart}
          />

          {/* Sol Açılır Menü */}
          <SidebarMenu
            isNavOpen={isNavOpen}
            activePage={activePage}
            setActivePage={setActivePage}
          />

          {/* Sağ Seçili Eleman Bilgi Paneli */}
          <AnimatePresence>
            {selectedPart && partData && (
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="absolute bottom-6 left-4 right-4 md:top-1/2 md:bottom-auto md:right-24 md:left-auto md:-translate-y-1/2 md:w-80 bg-[#070d1a]/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 pointer-events-auto z-20">
                <h2 className="font-display text-xl md:text-2xl font-semibold text-white mb-2 tracking-[0.2em] uppercase">
                  {partData.name}
                </h2>
                <p className="text-gray-400 text-base mb-2 md:mb-8 max-h-32 md:max-h-none overflow-y-auto md:overflow-visible pr-1">
                  {partData.description}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Logo */}
          <div className="absolute top-4 left-4 md:top-8 md:right-12 md:left-auto pointer-events-auto z-30 select-none flex flex-col items-start md:items-center">
            <img
              src="/logo_yazı.png"
              alt="Volinor Logo"
              onClick={() => {
                navigate("/");
                setIsNavOpen(false); // Eğer menü açıksa kapatarak dönmesi için
              }}
              className="h-10 md:h-16 w-auto shrink-0 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] cursor-pointer hover:opacity-80 transition-opacity"
            />
          </div>

          {/* Tam Ekran Bilgi ve Form Modalı */}
          <PageModal
            activePage={activePage}
            setActivePage={setActivePage}
            setIsNavOpen={setIsNavOpen}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
