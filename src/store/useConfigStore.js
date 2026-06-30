/**
 * useConfigStore.js
 * Zustand kullanılarak oluşturulmuş global durum (state) yönetim dosyasıdır.
 * Uygulamanın her yerinden erişilebilen değişkenleri (hangi modelin/parçanın seçildiği,
 * UI'ın açık/kapalı olma durumu vb.) tutar ve günceller.
 */
import { create } from 'zustand';

// Arı konfigürasyonu ve 3D sahne durumlarını yöneten global Zustand store
export const useConfigStore = create((set) => ({
  selectedModel: 'bee',
  setSelectedModel: (model) => set({ selectedModel: model }),

  selectedPart: null,
  setSelectedPart: (partName) => set({ selectedPart: partName }),

  showUI: true,
  setShowUI: (show) => set({ showUI: show }),

  isLoadingDone: false,
  setLoadingDone: (val) => set({ isLoadingDone: val }),

  activePage: null,
  setActivePage: (page) => set({ activePage: page }),

  dodgeTargetX: 0,
  setDodgeTargetX: (val) => set({ dodgeTargetX: val }),
  dodgeTargetY: 0,
  setDodgeTargetY: (val) => set({ dodgeTargetY: val }),

  isLoggedIn: false,
  setIsLoggedIn: (val) => set({ isLoggedIn: val }),

  userEmail: '',
  setUserEmail: (val) => set({ userEmail: val }),
}));
