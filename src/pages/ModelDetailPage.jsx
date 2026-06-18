import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "motion/react";

const API = "http://localhost:8000";

const ChevronLeftIcon = ({ className = "" }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6"/>
  </svg>
);

const ChevronRightIcon = ({ className = "" }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6"/>
  </svg>
);

const ArrowLeftIcon = ({ className = "" }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 19-7-7 7-7"/>
    <path d="M19 12H5"/>
  </svg>
);

const DownloadIcon = ({ className = "" }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

const CalendarIcon = ({ className = "" }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const ModelDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [loginWarning, setLoginWarning] = useState(false);

  useEffect(() => {
    axios.get(`${API}/api/models/${id}/`)
      .then((res) => setModel(res.data))
      .catch(() => setModel(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDownload = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setLoginWarning(true);
      return;
    }
    setLoginWarning(false);

    setDownloading(true);
    try {
      const res = await axios.get(`${API}/api/models/${id}/download/`, {
        headers: { Authorization: `Token ${token}` },
        responseType: "blob",
      });

      const contentType = res.headers["content-type"] || "";
      if (contentType.includes("application/json")) {
        const text = await res.data.text();
        const json = JSON.parse(text);
        if (json.type === "external") {
          window.open(json.url, "_blank", "noopener,noreferrer");
        }
      } else {
        const disposition = res.headers["content-disposition"] || "";
        const match = disposition.match(/filename="?([^"]+)"?/);
        const filename = match ? match[1] : "download";
        const blobUrl = window.URL.createObjectURL(res.data);
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(blobUrl);
      }
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user_email");
        setLoginWarning(true);
      }
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-zinc-800 border-t-cyan-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!model) {
    return (
      <div className="w-full min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white">
        <h1 className="text-4xl font-bold text-cyan-500 mb-4">404</h1>
        <p className="text-zinc-400 mb-8">Model bulunamadı.</p>
        <button
          onClick={() => navigate("/model-kutuphanesi")}
          className="px-6 py-2 bg-zinc-900 border border-zinc-700 hover:border-cyan-500 rounded-lg transition-all"
        >
          Kütüphaneye Dön
        </button>
      </div>
    );
  }

  const imageList = model.images.length > 0 ? model.images : [null];
  const formattedDate = new Date(model.created_at).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="h-screen overflow-y-auto overflow-x-hidden bg-zinc-950 text-zinc-200 font-sans selection:bg-cyan-500/30">
      <header className="sticky top-0 z-50 h-16 border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-8 h-full flex items-center">
          <button
            onClick={() => navigate("/model-kutuphanesi")}
            className="flex items-center gap-2 text-sm font-medium tracking-widest text-zinc-400 hover:text-cyan-400 transition-colors group"
          >
            <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="hidden sm:block">KÜTÜPHANEYE DÖN</span>
          </button>
        </div>
      </header>

      <main className="relative z-10 max-w-[1600px] mx-auto p-4 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12"
        >
          <div className="lg:col-span-8 space-y-4">
            <div className="relative aspect-video lg:aspect-[2/1] w-full bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800/60 shadow-2xl">
              {imageList[currentImageIndex] ? (
                <img
                  src={imageList[currentImageIndex]}
                  alt={model.name}
                  className="w-full h-full object-contain p-4"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-700">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent pointer-events-none" />

              {imageList.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImageIndex((p) => (p - 1 + imageList.length) % imageList.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-zinc-950/50 hover:bg-cyan-500/80 text-zinc-300 hover:text-white border border-zinc-700/50 backdrop-blur transition-all"
                  >
                    <ChevronLeftIcon className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex((p) => (p + 1) % imageList.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-zinc-950/50 hover:bg-cyan-500/80 text-zinc-300 hover:text-white border border-zinc-700/50 backdrop-blur transition-all"
                  >
                    <ChevronRightIcon className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {imageList.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {imageList.map((img, index) => (
                  <div
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-24 h-16 sm:w-28 sm:h-20 bg-zinc-900 rounded-lg overflow-hidden border transition-all cursor-pointer ${
                      index === currentImageIndex
                        ? "border-cyan-500 opacity-100 ring-2 ring-cyan-500/50"
                        : "border-zinc-800 opacity-60 hover:opacity-100"
                    }`}
                  >
                    {img && <img src={img} alt="thumbnail" className="w-full h-full object-cover" />}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-4 flex flex-col">
            <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800/60 rounded-2xl p-6 lg:p-8 flex-1">
              <h1 className="text-3xl lg:text-4xl font-bold text-zinc-100 mb-2">{model.name}</h1>
              {model.description && (
                <p className="text-zinc-400 mb-8 leading-relaxed">{model.description}</p>
              )}

              <div className="grid grid-cols-1 gap-4 mb-8">
                <div className="p-4 bg-zinc-950/50 rounded-xl border border-zinc-800/50">
                  <div className="flex items-center gap-2 text-zinc-500 mb-1">
                    <CalendarIcon className="w-4 h-4" />
                    <span className="text-xs font-bold tracking-widest uppercase">Eklenme Tarihi</span>
                  </div>
                  <div className="text-lg font-mono text-zinc-200">{formattedDate}</div>
                </div>
              </div>

              {model.has_download && (
                <div className="mt-4 space-y-3">
                  <button
                    onClick={handleDownload}
                    disabled={downloading}
                    className="group relative w-full flex items-center justify-center gap-3 p-4 bg-cyan-600 hover:bg-cyan-500 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white rounded-xl transition-all overflow-hidden shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:shadow-[0_0_30px_rgba(34,211,238,0.4)]"
                  >
                    {!downloading && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                    )}
                    {downloading ? (
                      <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <DownloadIcon className="w-6 h-6" />
                    )}
                    <span className="font-bold tracking-widest uppercase text-lg">
                      {downloading ? "İndiriliyor..." : "Modeli İndir"}
                    </span>
                  </button>
                  {loginWarning && (
                    <p className="text-center text-sm text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-lg py-2.5 px-4">
                      Bu içeriği indirmek için{" "}
                      <button onClick={() => navigate("/auth")} className="underline hover:text-amber-300 transition-colors">
                        giriş yapmalısınız
                      </button>
                      .
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default ModelDetailPage;
