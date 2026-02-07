import { createStore, type StoreApi } from 'zustand';
import type { User } from '@supabase/supabase-js';

export interface AppState {
  sidebarCollapsed: boolean;
  mobileSidebarActive: boolean;
  activeModal: string | null;
  pendingRoute: string | null;
  currentUser: User | null;
  // Navigation guard - returns true if navigation should be blocked
  navigationGuard: (() => boolean) | null;
  // Fullscreen mode - hides sidebar and topbar completely
  fullscreenMode: boolean;
  setSidebarCollapsed: (value: boolean) => void;
  toggleSidebarCollapsed: () => void;
  setMobileSidebarActive: (value: boolean) => void;
  toggleMobileSidebar: () => void;
  closeMobileSidebar: () => void;
  openModal: (modalId: string) => void;
  closeModal: () => void;
  setPendingRoute: (route: string | null) => void;
  setCurrentUser: (user: User | null) => void;
  setNavigationGuard: (guard: (() => boolean) | null) => void;
  setFullscreenMode: (value: boolean) => void;
}

const INITIAL_STATE = {
  sidebarCollapsed: false,
  mobileSidebarActive: false,
  activeModal: null,
  pendingRoute: null,
  currentUser: null,
  navigationGuard: null,
  fullscreenMode: false,
} as const;

export type AppStore = StoreApi<AppState>;

export type AppStoreHydrationState = Partial<
  Pick<
    AppState,
    | 'sidebarCollapsed'
    | 'mobileSidebarActive'
    | 'activeModal'
    | 'pendingRoute'
    | 'currentUser'
    | 'fullscreenMode'
  >
>;

export const createAppStore = (
  initialState: AppStoreHydrationState = {}
): AppStore =>
  createStore<AppState>()((set) => ({
    sidebarCollapsed:
      initialState.sidebarCollapsed ?? INITIAL_STATE.sidebarCollapsed,
    mobileSidebarActive:
      initialState.mobileSidebarActive ?? INITIAL_STATE.mobileSidebarActive,
    activeModal: initialState.activeModal ?? INITIAL_STATE.activeModal,
    pendingRoute: initialState.pendingRoute ?? INITIAL_STATE.pendingRoute,
    currentUser: initialState.currentUser ?? INITIAL_STATE.currentUser,
    navigationGuard: INITIAL_STATE.navigationGuard,
    fullscreenMode:
      initialState.fullscreenMode ?? INITIAL_STATE.fullscreenMode,
    setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
    toggleSidebarCollapsed: () =>
      set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
    setMobileSidebarActive: (mobileSidebarActive) =>
      set({ mobileSidebarActive }),
    toggleMobileSidebar: () =>
      set((state) => ({ mobileSidebarActive: !state.mobileSidebarActive })),
    closeMobileSidebar: () => set({ mobileSidebarActive: false }),
    openModal: (modalId) => set({ activeModal: modalId }),
    closeModal: () => set({ activeModal: null }),
    setPendingRoute: (route) => set({ pendingRoute: route }),
    setCurrentUser: (user) => set({ currentUser: user }),
    setNavigationGuard: (guard) => set({ navigationGuard: guard }),
    setFullscreenMode: (fullscreenMode) => set({ fullscreenMode }),
  }));

export const selectSidebarCollapsed = (state: AppState) =>
  state.sidebarCollapsed;
export const selectMobileSidebarActive = (state: AppState) =>
  state.mobileSidebarActive;
export const selectActiveModal = (state: AppState) => state.activeModal;
export const selectPendingRoute = (state: AppState) => state.pendingRoute;
export const selectCurrentUser = (state: AppState) => state.currentUser;
export const selectNavigationGuard = (state: AppState) => state.navigationGuard;
export const selectFullscreenMode = (state: AppState) => state.fullscreenMode;

export const serializeAppState = (state: AppState): AppStoreHydrationState => ({
  sidebarCollapsed: state.sidebarCollapsed,
  mobileSidebarActive: state.mobileSidebarActive,
  activeModal: state.activeModal,
  pendingRoute: state.pendingRoute,
  currentUser: state.currentUser,
  fullscreenMode: state.fullscreenMode,
});
