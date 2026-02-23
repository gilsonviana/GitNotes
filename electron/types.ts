// Shared type definitions for Electron IPC communication

export interface SaveFileArgs {
  filePath: string;
  content: string;
}

export interface FileOperationResult {
  success: boolean;
  error?: string;
}

export interface ReadFileResult extends FileOperationResult {
  content?: string;
}

export interface FileDialogResult {
  canceled?: boolean;
  filePath?: string;
}

export interface ElectronAPI {
  saveFile: (filePath: string, content: string) => Promise<FileOperationResult>;
  readFile: (filePath: string) => Promise<ReadFileResult>;
  openFileDialog: () => Promise<FileDialogResult>;
  saveFileDialog: () => Promise<FileDialogResult>;
}
