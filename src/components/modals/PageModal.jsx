/**
 * PageModal.jsx
 * Menüden herhangi bir öğeye (Örn: Hakkımızda, İletişim) tıklandığında açılan
 * tam ekran bilgilendirme panelidir. İletişim formu gibi etkileşimli öğeleri içerir.
 */
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import VideoLibrary from "../../pages/VideoLibrary";

const References = [
  { id: 1, name: "Kara Kuvvetleri Komutanlığı", logo: "/logo/kara.png" },
  { id: 2, name: "Asfat A.Ş", logo: "/logo/asfat.png" },
  { id: 3, name: "TÜBİTAK MAM", logo: "/logo/tubitak.png" },
  { id: 4, name: "Makine ve Kimya Endüstrisi A.Ş", logo: "/logo/mke.png" },
  { id: 5, name: "Ermaksan ", logo: "/logo/ermaksan.png" },
  { id: 6, name: "Lingua Yayıncılık", logo: "/logo/lingua.png" },
  { id: 7, name: "LenoWorks", logo: "/logo/lenoworks.png" },
];

const Certificates = [
  {
    id: 1,
    name: "ISO 9001:2015",
    image: "/certificates/certificate1.png", // Buraya resim dosyasının yolu gelecek
    pdf: "/certificates/certificate1.pdf", // Buraya pdf dosyasının yolu gelecek
  },
];

const PAGE_TITLES = {
  hakkimizda: "HAKKIMIZDA",
  urunlerimiz: "ÜRÜNLERİMİZ",
  "sertifika-ve-patentler": "SERTİFİKA VE PATENTLER",
  referanslar: "REFERANSLAR",
  iletisim: "İLETİŞİM",
  "model-kutuphanesi": "MODEL KÜTÜPHANESİ",
  "video-kutuphanesi": "VİDEO KÜTÜPHANESİ",
};

export const PageModal = ({ activePage, setActivePage, setIsNavOpen }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitStatus, setSubmitStatus] = useState({
    loading: false,
    success: false,
    error: null,
  });

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus({ loading: true, success: false, error: null });

    try {
      const response = await fetch("http://localhost:8000/api/send-email/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      });

      if (!response.ok) throw new Error("Gönderim başarısız oldu");

      setSubmitStatus({ loading: false, success: true, error: null });
      setFormData({ name: "", email: "", message: "" });

      setTimeout(() => {
        setSubmitStatus((s) => ({ ...s, success: false }));
      }, 5000);
    } catch (err) {
      setSubmitStatus({
        loading: false,
        success: false,
        error: "Mesaj gönderilirken bir hata oluştu.",
      });
    }
  };

  const isWidePage =
    activePage === "referanslar" ||
    activePage === "video-kutuphanesi" ||
    activePage === "sertifika-ve-patentler" ||
    activePage === "iletisim";

  return (
    <AnimatePresence>
      {activePage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-y-0 left-0 md:left-[300px] right-0 z-[45] md:z-30 pointer-events-auto flex items-start md:items-center justify-start p-6 pt-24 md:p-16 bg-[#080f1e] border-l border-[#00e5ff]/10 overflow-y-auto custom-scrollbar">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            transition={{ delay: 0.1, type: "spring", damping: 25 }}
            className={`w-full pointer-events-auto text-left md:my-auto ${isWidePage ? "max-w-7xl" : "max-w-3xl"}`}>
            {/* Mobil Geri Dön Butonu */}
            <button
              onClick={() => {
                navigate("/");
                setActivePage(null);
              }}
              className="md:hidden font-display text-[#00e5ff]/80 hover:text-[#00e5ff] text-xs tracking-[0.25em] font-semibold mb-6 flex items-center gap-2 min-h-[44px]">
              <span className="text-lg">←</span> MENÜYE DÖN
            </button>

            <h1 className="font-display text-3xl md:text-5xl font-light tracking-[0.25em] md:tracking-[0.35em] text-white mb-8 md:mb-12">
              {PAGE_TITLES[activePage] || activePage}
            </h1>

            <div className="text-white/60 text-base md:text-lg font-light leading-relaxed">
              {activePage === "hakkimizda" && (
                <p>
                  Volinor, yenilikçi teknolojiler ve ileri mühendislik çözümleri
                  ile geleceğin hava araçlarını tasarlayan öncü bir teknoloji
                  şirketidir. Amacımız, sınırları zorlamak ve havacılık
                  endüstrisinde yeni bir çağ başlatmaktır.
                </p>
              )}
              {activePage === "iletisim" && (
                <div className="flex flex-col gap-8 md:gap-10 text-left">
                  {/* Üst kısım: İletişim bilgileri */}
                  <div>
                    <h3 className="font-display text-xl md:text-2xl font-semibold text-white mb-4 tracking-[0.2em]">
                      BİZE ULAŞIN
                    </h3>
                    <p className="leading-relaxed text-sm md:text-base">
                      E-posta: info@volinor.com
                      <br />
                      Telefon: +90 555 123 4567
                      <br />
                      Adres: Mustafa Kemal Mah. Dumlupınar Bul. No:280 G İç Kapı
                      No:1260, Çankaya / Ankara
                    </p>
                  </div>

                  {/* Alt kısım: Form + Google Maps yan yana */}
                  <div className="flex flex-col md:flex-row md:items-stretch gap-8 md:gap-12">
                    {/* Form */}
                    <div className="flex-1">
                      <form
                        className="flex flex-col gap-4"
                        onSubmit={handleEmailSubmit}>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              name: e.target.value,
                            })
                          }
                          placeholder="Adınız Soyadınız"
                          className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 transition-colors text-sm min-h-[44px]"
                          disabled={submitStatus.loading}
                        />
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              email: e.target.value,
                            })
                          }
                          placeholder="E-posta Adresiniz"
                          className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 transition-colors text-sm min-h-[44px]"
                          disabled={submitStatus.loading}
                        />
                        <textarea
                          placeholder="Mesajınız"
                          required
                          value={formData.message}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              message: e.target.value,
                            })
                          }
                          rows="4"
                          className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 transition-colors resize-none text-sm min-h-[100px]"
                          disabled={submitStatus.loading}></textarea>

                        {submitStatus.success && (
                          <div className="text-green-400 text-xs tracking-wider">
                            Mesajınız başarıyla gönderildi. Teşekkürler!
                          </div>
                        )}
                        {submitStatus.error && (
                          <div className="text-red-400 text-xs tracking-wider">
                            {submitStatus.error}
                          </div>
                        )}

                        <button
                          type="submit"
                          disabled={submitStatus.loading}
                          className={`font-display bg-white text-black text-sm tracking-[0.25em] font-semibold py-3 rounded-lg transition-colors mt-2 min-h-[44px] ${submitStatus.loading ? "opacity-50 cursor-not-allowed" : "hover:bg-white/80"}`}>
                          {submitStatus.loading ? "GÖNDERİLİYOR..." : "GÖNDER"}
                        </button>
                      </form>
                    </div>

                    {/* Google Maps */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="flex-1 flex flex-col">
                      <div className="h-full min-h-[300px] rounded-xl overflow-hidden border border-white/10 relative">
                        <iframe
                          title="Volinor Konum"
                          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3060.889!2d32.7487!3d39.9025!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14d34f190a9cea8f%3A0xd3862ea8bc96f59!2sMustafa%20Kemal%2C%20Dumlup%C4%B1nar%20Blv.%20No%3A280%2C%2006510%20%C3%87ankaya%2FAnkara!5e0!3m2!1str!2str!4v1718700000000!5m2!1str!2str"
                          className="absolute inset-0 w-full h-full"
                          style={{
                            border: 0,
                            filter:
                              "invert(90%) hue-rotate(180deg) brightness(0.95) contrast(0.9)",
                          }}
                          allowFullScreen=""
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                        />
                      </div>
                    </motion.div>
                  </div>
                </div>
              )}
              {activePage === "sertifika-ve-patentler" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10 mt-8">
                  {Certificates.map((cert, index) => (
                    <motion.div
                      key={cert.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex flex-col items-center bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-[#00e5ff]/30 transition-all group cursor-pointer"
                      onClick={() =>
                        window.open(cert.pdf || cert.image, "_blank")
                      }>
                      <div className="w-full aspect-[1/1.4] relative mb-5 overflow-hidden rounded-lg bg-black/40 flex items-center justify-center p-2">
                        <img
                          src={cert.image}
                          alt={cert.name}
                          className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-lg"
                        />
                      </div>
                      <h3 className="font-display tracking-[0.1em] text-white/90 group-hover:text-white text-center text-sm md:text-base font-semibold">
                        {cert.name}
                      </h3>
                      <span className="flex items-center gap-2 text-xs text-[#00e5ff]/70 mt-3 tracking-widest group-hover:text-[#00e5ff] transition-colors font-medium">
                        <span>DETAYLI GÖRÜNTÜLE</span>
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </span>
                    </motion.div>
                  ))}
                </div>
              )}
              {activePage === "referanslar" && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-12 items-center justify-items-center mt-8">
                  {References.map((ref, index) => (
                    <motion.div
                      key={ref.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-center w-full max-w-[280px] h-[160px] group cursor-pointer">
                      {ref.logo &&
                      (ref.logo.includes(".png") ||
                        ref.logo.includes(".jpg") ||
                        ref.logo.includes(".svg") ||
                        ref.logo.includes(".webp")) ? (
                        <img
                          src={
                            ref.logo.startsWith("public")
                              ? ref.logo.replace(/public[\\/]/, "/")
                              : ref.logo
                          }
                          alt={ref.name}
                          className="w-full h-full object-contain opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 drop-shadow-md"
                        />
                      ) : (
                        <span className="text-white/40 text-xl font-bold uppercase tracking-widest group-hover:text-white/80 transition-colors">
                          {ref.logo}
                        </span>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
              {activePage === "video-kutuphanesi" && (
                <div className="mt-8">
                  <VideoLibrary />
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
