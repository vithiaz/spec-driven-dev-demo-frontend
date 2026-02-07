import { createStore, type StoreApi } from 'zustand';
import type { ReactNode } from 'react';
import type { MenuItem } from 'primereact/menuitem';

export interface BreadcrumbItem {
  label: string;
  url?: string;
  command?: () => void;
}

// Configuration only - no state or callbacks
export interface PageHeaderConfig {
  title?: string;
  breadcrumbs?: BreadcrumbItem[];
  tabs?: MenuItem[];
  search?: {
    placeholder: string;
    label?: string;
    helperText?: string;
    position?: 'right' | 'below';
    testId?: string;
  };
  actions?: ReactNode;
  actionsPosition?: 'right' | 'below';
}

// Full state including runtime values and callbacks
export interface PageHeaderState {
  // Configuration (static)
  config: PageHeaderConfig;

  // Runtime state
  activeTabIndex: number;
  searchValue: string;

  // Callbacks
  onTabChange?: (index: number) => void;
  onSearch?: (value: string) => void;

  // Actions for updating config
  setConfig: (config: PageHeaderConfig) => void;
  updateConfig: (config: Partial<PageHeaderConfig>) => void;
  clearConfig: () => void;

  // Actions for updating state
  setActiveTabIndex: (index: number) => void;
  setSearchValue: (value: string) => void;

  // Actions for setting callbacks
  setOnTabChange: (callback: (index: number) => void) => void;
  setOnSearch: (callback: (value: string) => void) => void;
  clearCallbacks: () => void;
}

const INITIAL_CONFIG: PageHeaderConfig = {};

export type PageHeaderStore = StoreApi<PageHeaderState>;

export type PageHeaderStoreHydrationState = Partial<
  Pick<PageHeaderState, 'config' | 'activeTabIndex' | 'searchValue'>
>;

export const createPageHeaderStore = (
  initialState: PageHeaderStoreHydrationState = {}
): PageHeaderStore =>
  createStore<PageHeaderState>()((set) => ({
    // Initial state
    config: initialState.config ?? INITIAL_CONFIG,
    activeTabIndex: initialState.activeTabIndex ?? 0,
    searchValue: initialState.searchValue ?? '',
    onTabChange: undefined,
    onSearch: undefined,

    // Config actions
    setConfig: (config) => set({ config }),
    updateConfig: (partialConfig) =>
      set((state) => ({ config: { ...state.config, ...partialConfig } })),
    clearConfig: () =>
      set({
        config: INITIAL_CONFIG,
        activeTabIndex: 0,
        searchValue: '',
      }),

    // State actions
    setActiveTabIndex: (activeTabIndex) => set({ activeTabIndex }),
    setSearchValue: (searchValue) => set({ searchValue }),

    // Callback actions
    setOnTabChange: (onTabChange) => set({ onTabChange }),
    setOnSearch: (onSearch) => set({ onSearch }),
    clearCallbacks: () => set({ onTabChange: undefined, onSearch: undefined }),
  }));

// Selectors
export const selectPageHeaderConfig = (state: PageHeaderState) => state.config;
export const selectPageHeaderTitle = (state: PageHeaderState) =>
  state.config.title;
export const selectPageHeaderBreadcrumbs = (state: PageHeaderState) =>
  state.config.breadcrumbs;
export const selectPageHeaderTabs = (state: PageHeaderState) =>
  state.config.tabs;
export const selectPageHeaderSearch = (state: PageHeaderState) =>
  state.config.search;
export const selectPageHeaderActions = (state: PageHeaderState) =>
  state.config.actions;
export const selectPageHeaderActiveTabIndex = (state: PageHeaderState) =>
  state.activeTabIndex;
export const selectPageHeaderSearchValue = (state: PageHeaderState) =>
  state.searchValue;
export const selectPageHeaderOnTabChange = (state: PageHeaderState) =>
  state.onTabChange;
export const selectPageHeaderOnSearch = (state: PageHeaderState) =>
  state.onSearch;

export const serializePageHeaderState = (
  state: PageHeaderState
): PageHeaderStoreHydrationState => ({
  config: state.config,
  activeTabIndex: state.activeTabIndex,
  searchValue: state.searchValue,
});
