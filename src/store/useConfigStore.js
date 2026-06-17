/**
 * useConfigStore.js
 * Zustand kullanılarak oluşturulmuş global durum (state) yönetim dosyasıdır.
 * Uygulamanın her yerinden erişilebilen değişkenleri (hangi modelin/parçanın seçildiği,
 * UI'ın açık/kapalı olma durumu vb.) tutar ve günceller.
 */
import { create } from 'zustand';
import { DEFAULT_CONFIG } from '../data/parts';

// Arı konfigürasyonu ve 3D sahne durumlarını yöneten global Zustand store
export const useConfigStore = create((set) => ({
  engineOn: false,
  setEngineOn: (val) => set({ engineOn: val }),
  isIntroFlying: false,
  setIsIntroFlying: (val) => set({ isIntroFlying: val }),
  
  controls: { w: false, a: false, s: false, d: false },
  setControl: (key, value) => set((state) => ({
    controls: { ...state.controls, [key]: value }
  })),
  
  joystick: { x: 0, y: 0 },
  setJoystick: (val) => set({ joystick: val }),

  dodgeTargetX: 0,
  setDodgeTargetX: (val) => set({ dodgeTargetX: val }),
  dodgeTargetY: 0,
  setDodgeTargetY: (val) => set({ dodgeTargetY: val }),

  selectedModel: 'bee',
  setSelectedModel: (model) => set({ selectedModel: model }),
  selectedPart: null,
  config: DEFAULT_CONFIG,
  
  showUI: true,
  setShowUI: (show) => set({ showUI: show }),
  
  isLoadingDone: false,
  setLoadingDone: (val) => set({ isLoadingDone: val }),

  activePage: null,
  setActivePage: (page) => set((state) => {
    return { activePage: page };
  }),
  
  isLoggedIn: false,
  setIsLoggedIn: (val) => set({ isLoggedIn: val }),
  
  setSelectedPart: (partName) => set((state) => {
    return { selectedPart: partName };
  }),
  
  updatePartConfig: (part, key, value) => set((state) => ({
    config: {
      ...state.config,
      [part]: {
        ...state.config[part],
        [key]: value
      }
    }
  })),
}));
