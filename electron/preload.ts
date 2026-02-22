import { contextBridge, ipcRenderer } from 'electron';

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
    electron: ElectronAPI;
  }
}

contextBridge.exposeInMainWorld('electron', {
  saveFile: (filePath: string, content: string) => ipcRenderer.invoke('save-file', { filePath, content }),
  readFile: (filePath: string) => ipcRenderer.invoke('read-file', filePath),
  openFileDialog: () => ipcRenderer.invoke('open-file-dialog'),
  saveFileDialog: () => ipcRenderer.invoke('save-file-dialog'),
});
