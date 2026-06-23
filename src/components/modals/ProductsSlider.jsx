import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ProductsSlider = () => {
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Django API'den ürünleri çek
    axios.get("http://localhost:8000/api/products/")
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.error("Ürünler yüklenirken hata oluştu:", err);
      });
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));
  };

  useEffect(() => {
    if (products.length === 0) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [currentIndex, products.length]);

  if (products.length === 0) {
    return (
      <div className="relative w-full h-[300px] md:h-[400px] rounded-2xl overflow-hidden group border border-white/10 bg-black/40 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 opacity-50">
          <svg className="w-8 h-8 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-sm tracking-widest font-semibold uppercase text-white">YÜKLENİYOR...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[300px] md:h-[400px] rounded-2xl overflow-hidden group border border-white/10 bg-black/40">
      <AnimatePresence initial={false}>
        <motion.img
          key={currentIndex}
          src={products[currentIndex].image}
          alt={products[currentIndex].title}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 0.6, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 flex flex-col items-start gap-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${currentIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full max-w-2xl"
          >
            <h2 className="font-display text-xl md:text-3xl font-semibold text-white mb-2 md:mb-3 tracking-wide drop-shadow-lg">
              {products[currentIndex].title}
            </h2>
            <p className="text-white/70 text-xs md:text-sm leading-relaxed line-clamp-3 mb-4">
              {products[currentIndex].description}
            </p>
            <button 
              className="px-5 py-2 md:px-6 md:py-2.5 bg-[#ffb800] text-black text-xs md:text-sm font-semibold rounded-lg hover:bg-[#e5a600] transition-all duration-300 shadow-[0_0_15px_rgba(255, 184, 0,0.4)] hover:shadow-[0_0_25px_rgba(255, 184, 0,0.6)] transform hover:-translate-y-0.5"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/urunler/${products[currentIndex].slug}`);
              }}
            >
              Detayları Görüntüle
            </button>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10 flex gap-3">
        <button
          onClick={prevSlide}
          className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 hover:text-white transition-all backdrop-blur-sm"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 hover:text-white transition-all backdrop-blur-sm"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Indicators */}
      <div className="absolute top-6 right-6 flex gap-2">
        {products.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-1 rounded-full transition-all duration-300 ${
              idx === currentIndex ? "w-8 bg-[#ffb800]" : "w-4 bg-white/20 hover:bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductsSlider;
