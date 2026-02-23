/// <reference types="vite/client" />

// Re-export types from electron/types for use in React app
import type { ElectronAPI } from '../electron/types';

declare global {
  interface Window {
    electron?: ElectronAPI;
  }
}

export {};
