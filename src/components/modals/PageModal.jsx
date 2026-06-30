import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import VideoLibrary from "../../pages/VideoLibrary";
import ProductsSlider from "./ProductsSlider";

const References = [
  { id: 1, name: "Kara Kuvvetleri Komutanlığı", logo: "/logo/kara.png" },
  { id: 2, name: "Asfat A.Ş", logo: "/logo/asfat.png" },
  { id: 3, name: "TÜBİTAK MAM", logo: "/logo/tubitak.png" },
  { id: 4, name: "Makine ve Kimya Endüstrisi A.Ş", logo: "/logo/mke.png" },
  { id: 5, name: "Ermaksan ", logo: "/logo/ermaksan.png" },
  { id: 6, name: "Lingua Yayıncılık", logo: "/logo/lingua.png" },
  { id: 7, name: "LenoWorks", logo: "/logo/lenoworks.png" },
];

const PdfPreview = ({ url }) => {
  const { t } = useTranslation();
  const [blobUrl, setBlobUrl] = useState(null);

  useEffect(() => {
    let objUrl;
    fetch(url)
      .then((r) => r.blob())
      .then((blob) => {
        objUrl = URL.createObjectURL(blob);
        setBlobUrl(objUrl);
      })
      .catch(() => {});
    return () => {
      if (objUrl) URL.revokeObjectURL(objUrl);
    };
  }, [url]);

  if (!blobUrl)
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-3">
        <svg
          className="w-10 h-10 text-white/20"
          fill="currentColor"
          viewBox="0 0 24 24">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM8 17h8v1H8v-1zm0-3h8v1H8v-1zm0-3h5v1H8v-1z" />
        </svg>
        <span className="text-white/20 text-xs tracking-widest">
          {t("ui.loading")}
        </span>
      </div>
    );

  return (
    <iframe
      src={`${blobUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
      title="pdf-preview"
      className="w-full h-full border-0 pointer-events-none"
    />
  );
};

export const PageModal = ({ activePage, setActivePage, setIsNavOpen }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
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
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    if (activePage === "sertifika-ve-patentler") {
      fetch("http://localhost:8000/api/certificates/")
        .then((r) => r.json())
        .then(setCertificates)
        .catch(() => {});
    }
  }, [activePage]);

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

      if (!response.ok) throw new Error("send_failed");

      setSubmitStatus({ loading: false, success: true, error: null });
      setFormData({ name: "", email: "", message: "" });

      setTimeout(() => {
        setSubmitStatus((s) => ({ ...s, success: false }));
      }, 5000);
    } catch {
      setSubmitStatus({
        loading: false,
        success: false,
        error: t("contact.error"),
      });
    }
  };

  const isWidePage =
    activePage === "urunlerimiz" ||
    activePage === "referanslar" ||
    activePage === "video-kutuphanesi" ||
    activePage === "sertifika-ve-patentler" ||
    activePage === "iletisim" ||
    activePage === "hakkimizda";

  return (
    <AnimatePresence>
      {activePage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`absolute inset-y-0 left-0 md:left-[300px] right-0 z-[45] md:z-30 pointer-events-auto flex items-start md:items-center justify-start p-6 pt-24 md:p-16 border-l border-[#ffb800]/10 ${activePage === "hakkimizda" ? "overflow-hidden bg-[#0a0a0a]" : "overflow-y-auto custom-scrollbar bg-[#0a0a0a]"}`}>
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            transition={{ delay: 0.1, type: "spring", damping: 25 }}
            className={`w-full pointer-events-auto text-left md:my-auto ${activePage === "hakkimizda" ? "h-full flex flex-col justify-center" : ""} ${isWidePage ? "max-w-7xl" : "max-w-3xl"}`}>
            <button
              onClick={() => {
                navigate("/");
                setActivePage(null);
              }}
              className="md:hidden font-display text-[#ffb800]/80 hover:text-[#ffb800] text-xs tracking-[0.25em] font-semibold mb-6 flex items-center gap-2 min-h-[44px]">
              <span className="text-lg">←</span> {t("ui.back_to_menu")}
            </button>

            {activePage !== "hakkimizda" && (
              <h1
                className={`font-display text-3xl md:text-5xl font-light tracking-[0.25em] md:tracking-[0.35em] text-white ${
                  activePage === "iletisim" ||
                  activePage === "model-kutuphanesi"
                    ? "sr-only"
                    : "mb-4 md:mb-6"
                }`}>
                {t(`pages.${activePage}`, activePage)}
              </h1>
            )}

            <div className="text-white/60 text-base md:text-lg font-light leading-relaxed">
              {activePage === "hakkimizda" && (
                <>
                  <div className="relative w-full">
                    <div className="flex flex-col lg:flex-row gap-10 lg:gap-12 items-start justify-between">
                      <div className="flex flex-col gap-3 w-full lg:w-[55%]">
                        <div className="mb-1">
                          <h1 className="font-display text-2xl md:text-4xl font-light tracking-[0.25em] md:tracking-[0.3em] text-white">
                            HAKKIMIZDA
                          </h1>
                          <div className="h-[3px] w-10 bg-[#ffb800] mt-2"></div>
                        </div>
                        <p className="text-sm md:text-base text-white/80 leading-relaxed">
                          {t("about.p1")}
                        </p>
                        <p className="text-sm md:text-base text-white/80 leading-relaxed">
                          {t("about.p2")}
                        </p>

                        <div className="flex flex-col mt-0">
                          {[
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round">
                              <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.9 1.2 1.5 1.5 2.5" />
                              <path d="M9 18h6" />
                              <path d="M10 22h4" />
                              <path d="M12 2v1" />
                            </svg>,
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round">
                              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                              <line x1="12" y1="22.08" x2="12" y2="12" />
                            </svg>,
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round">
                              <rect x="16" y="16" width="6" height="6" rx="1" />
                              <rect x="2" y="16" width="6" height="6" rx="1" />
                              <rect x="9" y="2" width="6" height="6" rx="1" />
                              <path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3" />
                              <path d="M12 12V8" />
                            </svg>,
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round">
                              <rect
                                x="2"
                                y="3"
                                width="20"
                                height="14"
                                rx="2"
                                ry="2"
                              />
                              <line x1="8" y1="21" x2="16" y2="21" />
                              <line x1="12" y1="17" x2="12" y2="21" />
                              <polygon points="10 8 15 10 10 12 10 8" />
                            </svg>,
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round">
                              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                            </svg>,
                          ].map((icon, idx) => {
                            const num = idx + 1;
                            return (
                              <div key={num} className="group">
                                <div className="flex items-center gap-4 py-1.5">
                                  <div className="relative w-12 h-12 flex-shrink-0 flex items-center justify-center text-[#ffb800]/50 group-hover:text-[#ffb800] transition-colors">
                                    <svg
                                      className="absolute inset-0 w-full h-full text-[#ffb800]/30 group-hover:text-[#ffb800]/60 transition-colors"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="1.5">
                                      <polygon points="12 2 21 7 21 17 12 22 3 17 3 7 12 2" />
                                    </svg>
                                    {icon}
                                  </div>
                                  <span className="text-sm md:text-base text-white/70 group-hover:text-white/90 transition-colors">
                                    {t(`about.li${num}`)}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div className="w-full lg:w-[40%] flex justify-center lg:justify-end mt-2 lg:mt-0">
                        <div className="relative w-full max-w-sm lg:max-w-[380px] rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(255,184,0,0.05)] border border-[#ffb800]/10 group">
                          <img
                            src="/odtü-foto.jpeg"
                            alt="ODTÜ"
                            className="w-full h-[530px] object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 pointer-events-none"></div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {activePage === "urunlerimiz" && (
                <div className="w-full mt-4 md:mt-6">
                  <ProductsSlider />
                </div>
              )}
              {activePage === "iletisim" && (
                <div className="flex flex-col gap-8 md:gap-10 text-left">
                  <div>
                    <h3 className="font-display text-xl md:text-2xl font-semibold text-white mb-4 tracking-[0.2em]">
                      {t("contact.heading")}
                    </h3>
                    <p className="leading-relaxed text-sm md:text-base">
                      info@volinor.com
                      <br />
                      +90 555 123 4567
                      <br />
                      Mustafa Kemal Mah. Dumlupınar Bul. No:280 G İç Kapı
                      No:1260, Çankaya / Ankara
                    </p>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-stretch gap-8 md:gap-12">
                    <div className="flex-1">
                      <form
                        className="flex flex-col gap-4"
                        onSubmit={handleEmailSubmit}>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          placeholder={t("contact.name_placeholder")}
                          className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 transition-colors text-sm min-h-[44px]"
                          disabled={submitStatus.loading}
                        />
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          placeholder={t("contact.email_placeholder")}
                          className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 transition-colors text-sm min-h-[44px]"
                          disabled={submitStatus.loading}
                        />
                        <textarea
                          placeholder={t("contact.message_placeholder")}
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
                            {t("contact.success")}
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
                          {submitStatus.loading
                            ? t("contact.sending")
                            : t("contact.send")}
                        </button>
                      </form>
                    </div>

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
                  {certificates.map((cert, index) => (
                    <motion.div
                      key={cert.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex flex-col items-center bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-[#ffb800]/30 transition-all group cursor-pointer"
                      onClick={() =>
                        window.open(
                          cert.verification_link || cert.document,
                          "_blank",
                        )
                      }>
                      <div className="w-full aspect-[1/1.4] relative mb-5 overflow-hidden rounded-lg bg-black/40">
                        {cert.document?.toLowerCase().endsWith(".pdf") ? (
                          <PdfPreview url={cert.document} />
                        ) : (
                          <img
                            src={cert.document}
                            alt={cert.name}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-lg p-2"
                          />
                        )}
                      </div>
                      <h3 className="font-display tracking-[0.1em] text-white/90 group-hover:text-white text-center text-sm md:text-base font-semibold">
                        {cert.name}
                      </h3>
                      <p className="text-white/40 text-xs mt-1 tracking-wider">
                        {cert.issued_by}
                      </p>
                      <span className="flex items-center gap-2 text-xs text-[#ffb800]/70 mt-3 tracking-widest group-hover:text-[#ffb800] transition-colors font-medium">
                        <span>{t("ui.view_detail")}</span>
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
