import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useConfigStore } from "../../store/useConfigStore";
import "./ModelLibraryPage.css";

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

export const ModelLibraryPage = () => {
  const [activeModelId, setActiveModelId] = useState(MOCK_MODELS[0].id);
  const [searchTerm, setSearchTerm] = useState("");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const isLoggedIn = useConfigStore((state) => state.isLoggedIn);
  const setIsLoggedIn = useConfigStore((state) => state.setIsLoggedIn);
  const navigate = useNavigate();

  const activeModel =
    MOCK_MODELS.find((m) => m.id === activeModelId) || MOCK_MODELS[0];

  const filteredModels = MOCK_MODELS.filter(
    (model) =>
      model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsUserMenuOpen(false);
  };

  return (
    <div className="model-library-container">
      <div className="model-library-grid-bg"></div>

      <header className="model-library-header">
        <Link to="/" className="model-library-back-btn">
          <span>←</span>
          <span>MAIN SYSTEM</span>
        </Link>
        <div className="model-library-header-right">
          <h1 className="model-library-title">ASSET ARCHIVE</h1>
          {!isLoggedIn ? (
            <Link to="/auth" className="auth-action-btn">
              GİRİŞ YAP
            </Link>
          ) : (
            <div className="auth-user-menu">
              <div
                className="auth-user-icon"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="auth-dropdown">
                    <button
                      className="auth-dropdown-item"
                      onClick={handleLogout}>
                      ÇIKIŞ YAP
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </header>

      <main className="model-library-content">
        <aside className="model-library-list-panel">
          <div className="model-list-header">
            <input
              type="text"
              className="model-search-input"
              placeholder="SEARCH ASSETS..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <ul className="model-list">
            {filteredModels.map((model) => (
              <li
                key={model.id}
                className={`model-list-item ${activeModelId === model.id ? "active" : ""}`}
                onClick={() => setActiveModelId(model.id)}>
                <div className="model-item-name">{model.name}</div>
                <div className="model-item-meta">
                  <span>{model.category}</span>
                  <span>//</span>
                  <span>{model.date}</span>
                </div>
              </li>
            ))}
          </ul>
        </aside>

        <section className="model-library-detail-panel">
          <div className="model-viewer-placeholder">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeModel.image}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                src={activeModel.image}
                alt={activeModel.name}
                className="model-viewer-image"
              />
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeModel.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="model-info-section">
              <div className="model-info-main">
                <h2>{activeModel.name}</h2>
                <div className="model-info-stats">
                  <div className="stat-item">
                    <span className="stat-label">POLYGONS</span>
                    <span className="stat-value">{activeModel.polyCount}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">MATERIALS</span>
                    <span className="stat-value">{activeModel.materials}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">ID</span>
                    <span className="stat-value">
                      {activeModel.id.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="model-download-section">
                <span className="download-title">AVAILABLE FORMATS</span>
                <div className="download-buttons">
                  {activeModel.downloads.map((dl) => (
                    <button key={dl.format} className="download-btn">
                      <span>
                        .{dl.format}
                        <span className="download-size">{dl.size}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
};

export default ModelLibraryPage;
