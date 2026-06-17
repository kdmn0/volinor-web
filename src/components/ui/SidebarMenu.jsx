/**
 * SidebarMenu.jsx
 * Ekranın sol kenarından açılıp kapanan ana gezinme (navigasyon) menüsüdür.
 * İçerisinde Hakkımızda, Ürünlerimiz gibi kurumsal site linklerini barındırır.
 */
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";

const NAV_ITEMS = [
  { label: "HAKKIMIZDA", url: "/hakkimizda", id: "hakkimizda" },
  { label: "ÜRÜNLERİMİZ", url: "/urunlerimiz", id: "urunlerimiz" },
  { label: "SERTİFİKA VE PATENTLER", url: "/sertifika-ve-patentler", id: "sertifika-ve-patentler" },
  { label: "REFERANSLAR", url: "/referanslar", id: "referanslar" },
  { label: "İLETİŞİM", url: "/iletisim", id: "iletisim" },
  { label: "MODEL KÜTÜPHANESİ", url: "/model-kutuphanesi", id: "model-kutuphanesi" },
  { label: "VİDEO KÜTÜPHANESİ", url: "/video-kutuphanesi", id: "video-kutuphanesi" },
];

export const SidebarMenu = ({ isNavOpen, activePage, setActivePage }) => {
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
            const isActive = activePage === item.id || activePage === item.label; // Backward compatibility check just in case
            return (
              <motion.div
                key={item.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ delay: 0.05 + i * 0.05 }}
              >
                <Link
                  to={item.url}
                  onClick={() => setActivePage && setActivePage(item.id)}
                  className={`font-display text-sm md:text-xs tracking-[0.2em] md:tracking-[0.25em] font-semibold transition-all duration-300 relative group w-full whitespace-nowrap min-h-[44px] flex items-center ${isActive ? "text-[#00e5ff] drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]" : "text-white/50 hover:text-white"}`}>
                  
                  {/* Sol Dikey Çizgi */}
                  <div 
                    className={`absolute -left-6 top-1/2 -translate-y-1/2 w-[2px] transition-all duration-300 rounded-full ${isActive ? "h-8 bg-[#00e5ff] shadow-[0_0_15px_#00e5ff]" : "h-0 bg-[#00e5ff]/50 group-hover:h-6 group-hover:bg-[#00e5ff] group-hover:shadow-[0_0_10px_#00e5ff]"}`} 
                  />
                  
                  <span className="relative z-10">{item.label}</span>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
