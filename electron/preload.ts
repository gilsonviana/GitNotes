import { contextBridge, ipcRenderer } from 'electron';
import type { ElectronAPI } from './types';

const electronApi: ElectronAPI = {
  saveFile: (filePath: string, content: string) => ipcRenderer.invoke('save-file', { filePath, content }),
  readFile: (filePath: string) => ipcRenderer.invoke('read-file', filePath),
  openFileDialog: () => ipcRenderer.invoke('open-file-dialog'),
  saveFileDialog: () => ipcRenderer.invoke('save-file-dialog'),
};

contextBridge.exposeInMainWorld('electron', electronApi);
