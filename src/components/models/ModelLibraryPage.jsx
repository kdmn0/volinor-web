import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useConfigStore } from "../../store/useConfigStore";

const MOCK_MODELS = [
  {
    id: "vln-drone-x1",
    name: "VLN Drone X-1",
    category: "AERIAL",
    polyCount: "124,500",
    materials: 8,
    date: "2025.10.12",
    image:
      "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?q=80&w=800&auto=format&fit=crop",
    downloads: [
      { format: "FBX", size: "24 MB" },
      { format: "GLTF", size: "18 MB" },
      { format: "OBJ", size: "32 MB" },
    ],
  },
  {
    id: "comp-wing-v2",
    name: "Composite Wing Panel V2",
    category: "AEROSPACE",
    polyCount: "86,200",
    materials: 4,
    date: "2025.11.04",
    image:
      "https://images.unsplash.com/photo-1540826456073-61b6c0033c46?q=80&w=800&auto=format&fit=crop",
    downloads: [
      { format: "STEP", size: "45 MB" },
      { format: "IGES", size: "48 MB" },
      { format: "GLTF", size: "12 MB" },
    ],
  },
  {
    id: "ai-vision-module",
    name: "AI Vision Module",
    category: "HARDWARE",
    polyCount: "45,100",
    materials: 12,
    date: "2026.01.18",
    image:
      "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?q=80&w=800&auto=format&fit=crop",
    downloads: [
      { format: "FBX", size: "15 MB" },
      { format: "GLTF", size: "9 MB" },
    ],
  },
  {
    id: "sim-terrain-alpha",
    name: "Simulation Terrain Alpha",
    category: "ENVIRONMENT",
    polyCount: "1,200,000",
    materials: 24,
    date: "2026.03.22",
    image:
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?q=80&w=800&auto=format&fit=crop",
    downloads: [
      { format: "FBX", size: "145 MB" },
      { format: "OBJ", size: "180 MB" },
    ],
  },
  {
    id: "cyber-arm-v1",
    name: "Cyber Arm V1",
    category: "PROSTHETICS",
    polyCount: "150,000",
    materials: 10,
    date: "2026.04.10",
    image:
      "https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=800&auto=format&fit=crop",
    downloads: [
      { format: "FBX", size: "30 MB" },
      { format: "OBJ", size: "45 MB" },
    ],
  },
  {
    id: "mech-suit-prototype",
    name: "Mech Suit Prototype",
    category: "ARMOR",
    polyCount: "500,000",
    materials: 15,
    date: "2026.05.01",
    image:
      "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?q=80&w=800&auto=format&fit=crop",
    downloads: [
      { format: "FBX", size: "100 MB" },
      { format: "GLTF", size: "85 MB" },
    ],
  },
  {
    id: "holo-emitter-x",
    name: "Holo Emitter X",
    category: "HARDWARE",
    polyCount: "25,000",
    materials: 5,
    date: "2026.05.15",
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop",
    downloads: [
      { format: "GLTF", size: "5 MB" },
      { format: "OBJ", size: "8 MB" },
    ],
  },
  {
    id: "quantum-core",
    name: "Quantum Core",
    category: "ENERGY",
    polyCount: "80,000",
    materials: 8,
    date: "2026.05.20",
    image:
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=800&auto=format&fit=crop",
    downloads: [
      { format: "STEP", size: "20 MB" },
      { format: "FBX", size: "12 MB" },
    ],
  },
  {
    id: "neo-tokyo-building",
    name: "Neo Tokyo Building",
    category: "ARCHITECTURE",
    polyCount: "2,500,000",
    materials: 45,
    date: "2026.05.25",
    image:
      "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=800&auto=format&fit=crop",
    downloads: [
      { format: "FBX", size: "300 MB" },
      { format: "OBJ", size: "450 MB" },
    ],
  },
  {
    id: "plasma-rifle-mk2",
    name: "Plasma Rifle MK2",
    category: "WEAPON",
    polyCount: "65,000",
    materials: 6,
    date: "2026.06.01",
    image:
      "https://images.unsplash.com/photo-1593118933355-87bd89cb1f1c?q=80&w=800&auto=format&fit=crop",
    downloads: [
      { format: "FBX", size: "18 MB" },
      { format: "GLTF", size: "15 MB" },
    ],
  },
  {
    id: "hover-bike-z",
    name: "Hover Bike Z",
    category: "VEHICLE",
    polyCount: "120,000",
    materials: 12,
    date: "2026.06.05",
    image:
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=800&auto=format&fit=crop",
    downloads: [
      { format: "FBX", size: "40 MB" },
      { format: "OBJ", size: "55 MB" },
    ],
  },
  {
    id: "android-head-model",
    name: "Android Head Model",
    category: "CHARACTER",
    polyCount: "200,000",
    materials: 14,
    date: "2026.06.10",
    image:
      "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=800&auto=format&fit=crop",
    downloads: [
      { format: "FBX", size: "60 MB" },
      { format: "GLTF", size: "45 MB" },
    ],
  },
  {
    id: "space-station-hub",
    name: "Space Station Hub",
    category: "ENVIRONMENT",
    polyCount: "3,000,000",
    materials: 60,
    date: "2026.06.12",
    image:
      "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=800&auto=format&fit=crop",
    downloads: [
      { format: "FBX", size: "500 MB" },
      { format: "OBJ", size: "750 MB" },
    ],
  },
  {
    id: "nano-bot-swarm",
    name: "Nano Bot Swarm",
    category: "PARTICLES",
    polyCount: "15,000",
    materials: 2,
    date: "2026.06.15",
    image:
      "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=800&auto=format&fit=crop",
    downloads: [
      { format: "GLTF", size: "3 MB" },
      { format: "STEP", size: "5 MB" },
    ],
  },
];

const ArrowLeftIcon = ({ className = "" }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
);

const SearchIcon = ({ className = "" }) => (
  <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
);

const UserIcon = ({ className = "" }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);

const DownloadIcon = ({ className = "" }) => (
  <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
);

const LayersIcon = ({ className = "" }) => (
  <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
);

const BoxIcon = ({ className = "" }) => (
  <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
);

export const ModelLibraryPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const isLoggedIn = useConfigStore((state) => state.isLoggedIn);
  const setIsLoggedIn = useConfigStore((state) => state.setIsLoggedIn);

  const filteredModels = MOCK_MODELS.filter(
    (model) =>
      model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsUserMenuOpen(false);
  };

  return (
    <div className="h-screen overflow-y-auto overflow-x-hidden bg-zinc-950 text-zinc-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-950">
      {/* BACKGROUND EFFECTS */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[150px]" />
        <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />
      </div>

      {/* HEADER */}
      <header className="sticky top-0 z-50 h-16 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/60 px-6">
        <div className="max-w-[1600px] mx-auto h-full flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link 
              to="/" 
              className="flex items-center gap-2 text-sm font-medium tracking-widest text-zinc-400 hover:text-cyan-400 transition-colors group"
            >
              <ArrowLeftIcon className="group-hover:-translate-x-1 transition-transform" />
              MAIN SYSTEM
            </Link>
            <div className="w-px h-6 bg-zinc-800" />
            <h1 className="text-xl font-semibold tracking-widest bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
              ASSET ARCHIVE
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative hidden md:block w-64 lg:w-80">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-zinc-500">
                <SearchIcon />
              </div>
              <input
                type="text"
                className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-cyan-500/50 rounded-lg py-2 pl-10 pr-4 text-sm text-zinc-200 placeholder-zinc-600 outline-none transition-all shadow-inner"
                placeholder="SEARCH ASSETS..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {!isLoggedIn ? (
              <Link 
                to="/auth" 
                className="px-5 py-2 text-sm font-medium tracking-wider text-cyan-400 border border-cyan-400/30 rounded bg-cyan-400/5 hover:bg-cyan-400/10 transition-colors shadow-[0_0_15px_rgba(34,211,238,0.1)] hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]"
              >
                GİRİŞ YAP
              </Link>
            ) : (
              <div className="relative">
                <button
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 hover:border-cyan-500/50 hover:bg-zinc-800 transition-colors text-zinc-300"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  <UserIcon />
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-3 w-48 bg-zinc-900 border border-zinc-800 rounded-lg shadow-2xl overflow-hidden z-50 backdrop-blur-xl"
                    >
                      <div className="p-2 border-b border-zinc-800/50">
                        <p className="text-xs text-zinc-500 uppercase tracking-widest px-2 py-1">System User</p>
                      </div>
                      <div className="p-1">
                        <button
                          className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded transition-colors tracking-wide"
                          onClick={handleLogout}
                        >
                          ÇIKIŞ YAP
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MOBILE SEARCH (Visible only on small screens) */}
      <div className="md:hidden p-4 relative z-10 border-b border-zinc-800/50 bg-zinc-950/50 backdrop-blur">
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-zinc-500">
            <SearchIcon />
          </div>
          <input
            type="text"
            className="w-full bg-zinc-900 border border-zinc-800 focus:border-cyan-500/50 rounded-lg py-2.5 pl-10 pr-4 text-sm text-zinc-200 placeholder-zinc-600 outline-none transition-all shadow-inner"
            placeholder="SEARCH ASSETS..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* MAIN CONTENT (Grid Layout) */}
      <main className="relative z-10 max-w-[1600px] mx-auto p-4 lg:p-8">
        {filteredModels.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full border border-zinc-800 bg-zinc-900 flex items-center justify-center text-zinc-500 mb-4">
              <SearchIcon className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold tracking-widest text-zinc-300">NO ASSETS FOUND</h2>
            <p className="text-zinc-500 mt-2">Arama kriterlerinize uygun model bulunamadı.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredModels.map((model) => (
              <div
                key={model.id}
                className="group flex flex-col bg-zinc-900/40 backdrop-blur-md border border-zinc-800/60 rounded-2xl overflow-hidden hover:border-cyan-500/30 hover:shadow-[0_0_30px_rgba(34,211,238,0.05)] transition-all duration-300"
              >
                {/* IMAGE COVER */}
                <div className="relative aspect-[4/3] overflow-hidden bg-zinc-950">
                  <img
                    src={model.image}
                    alt={model.name}
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-900/20 to-transparent opacity-80" />
                  
                  {/* CATEGORY BADGE */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-zinc-900/80 backdrop-blur-md border border-zinc-700/50 rounded-full">
                    <LayersIcon className="w-3 h-3 text-cyan-400" />
                    <span className="text-[10px] font-bold tracking-wider text-zinc-300 uppercase">
                      {model.category}
                    </span>
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-5 flex flex-col flex-1 relative bg-zinc-900/50 border-t border-zinc-800/50">
                  <h3 className="text-lg font-bold tracking-wide text-zinc-100 group-hover:text-cyan-50 transition-colors line-clamp-1">
                    {model.name}
                  </h3>
                  
                  <div className="flex items-center gap-4 mt-3 text-xs text-zinc-500 font-mono tracking-wider">
                    <div className="flex items-center gap-1.5">
                      <BoxIcon className="w-3.5 h-3.5" />
                      {model.polyCount}
                    </div>
                    <div className="w-1 h-1 rounded-full bg-zinc-700" />
                    <div className="flex items-center gap-1.5">
                      <LayersIcon className="w-3.5 h-3.5" />
                      {model.materials}
                    </div>
                  </div>

                  {/* DOWNLOAD BUTTONS */}
                  <div className="mt-5 pt-4 border-t border-zinc-800/60 flex flex-wrap gap-2">
                    {model.downloads.map((dl) => (
                      <button
                        key={dl.format}
                        className="flex-1 min-w-[70px] flex flex-col items-center justify-center gap-1 py-2 px-2 bg-zinc-950 hover:bg-cyan-500/10 border border-zinc-800 hover:border-cyan-500/40 rounded-lg transition-all text-zinc-400 hover:text-cyan-300"
                        title={`${dl.format} İndir (${dl.size})`}
                      >
                        <DownloadIcon className="w-4 h-4 mb-0.5" />
                        <span className="text-[10px] font-bold tracking-widest">{dl.format}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ModelLibraryPage;
