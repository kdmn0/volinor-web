import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const SidebarMenu = ({ isNavOpen, activePage, setActivePage }) => {
  const { t } = useTranslation();

  const NAV_ITEMS = [
    { label: t("nav.about"), url: "/hakkimizda", id: "hakkimizda" },
    { label: t("nav.products"), url: "/urunlerimiz", id: "urunlerimiz" },
    { label: t("nav.modelLibrary"), url: "/model-kutuphanesi", id: "model-kutuphanesi" },
    { label: t("nav.videoLibrary"), url: "/video-kutuphanesi", id: "video-kutuphanesi" },
    { label: t("nav.references"), url: "/referanslar", id: "referanslar" },
    { label: t("nav.certificates"), url: "/sertifika-ve-patentler", id: "sertifika-ve-patentler" },
    { label: t("nav.contact"), url: "/iletisim", id: "iletisim" },
  ];

  return (
    <AnimatePresence>
      {isNavOpen && (
        <motion.div
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ type: "spring", damping: 30, stiffness: 200 }}
          className="absolute top-0 left-0 w-full md:w-[300px] h-full bg-black/90 md:bg-black/60 backdrop-blur-xl border-r border-[#00e5ff]/20 shadow-[10px_0_30px_rgba(0,229,255,0.05)] z-40 flex flex-col justify-center gap-3 md:gap-6 pl-8 md:pl-12 pr-6 pointer-events-auto overflow-y-auto pt-20 pb-10">
          {NAV_ITEMS.map((item, i) => {
            const isActive = activePage === item.id || activePage === item.label;
            return (
              <motion.div
                key={item.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ delay: 0.05 + i * 0.05 }}>
                <Link
                  to={item.url}
                  onClick={() => setActivePage && setActivePage(item.id)}
                  className={`font-display text-base md:text-sm tracking-[0.2em] md:tracking-[0.25em] font-semibold transition-all duration-300 relative group w-full whitespace-nowrap min-h-[44px] flex items-center ${isActive ? "text-[#00e5ff] drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]" : "text-white/50 hover:text-white"}`}>
                  <div
                    className={`absolute -left-6 top-1/2 -translate-y-1/2 w-[2px] transition-all duration-300 rounded-full ${isActive ? "h-8 bg-[#00e5ff] shadow-[0_0_15px_#00e5ff]" : "h-0 bg-[#00e5ff]/50 group-hover:h-6 group-hover:bg-[#00e5ff] group-hover:shadow-[0_0_10px_#00e5ff]"}`}
                  />
                  <span className="relative z-10 flex flex-col gap-1">
                    {item.id === "model-kutuphanesi" || item.id === "video-kutuphanesi" ? (
                      <>
                        <span>{item.label.split(" ")[0]}</span>
                        <span>{item.label.split(" ").slice(1).join(" ")}</span>
                      </>
                    ) : (
                      item.label
                    )}
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
