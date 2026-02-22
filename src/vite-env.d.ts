/// <reference types="vite/client" />

interface FileOperationResult {
  success: boolean;
  error?: string;
}

interface ReadFileResult extends FileOperationResult {
  content?: string;
}

interface FileDialogResult {
  canceled?: boolean;
  filePath?: string;
}

interface ElectronAPI {
  saveFile: (filePath: string, content: string) => Promise<FileOperationResult>;
  readFile: (filePath: string) => Promise<ReadFileResult>;
  openFileDialog: () => Promise<FileDialogResult>;
  saveFileDialog: () => Promise<FileDialogResult>;
}

declare global {
  interface Window {
    electron?: ElectronAPI;
  }
}

export {};
