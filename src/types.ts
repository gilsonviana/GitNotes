// Shared type definitions for the application

export interface Note {
  id: string;
  content: string;
  updatedAt: string;
  title: string;
}

export interface Notification {
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
}

export interface ConfirmDialog {
  message: string;
  onConfirm: () => void | Promise<void>;
}

// Enum for LocalStorage keys
export enum StorageKey {
  NOTES_LIST = 'notesList',
  GITHUB_TOKEN = 'githubToken',
  NOTE_PREFIX = 'note_'
}

// Helper function to generate note key
export const getNoteKey = (noteId: string): string => `${StorageKey.NOTE_PREFIX}${noteId}`;
