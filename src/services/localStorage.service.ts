import localforage from 'localforage';
import { StorageKey, getNoteKey, Note } from '../types';

// Configure localforage for offline storage
localforage.config({
  name: 'GitNotes',
  storeName: 'notes',
  description: 'Markdown notes storage'
});

export class LocalStorageService {
  // Note operations
  async saveNote(note: Note): Promise<void> {
    await localforage.setItem(getNoteKey(note.id), note);
  }

  async getNote(noteId: string): Promise<Note | null> {
    return await localforage.getItem<Note>(getNoteKey(noteId));
  }

  async deleteNote(noteId: string): Promise<void> {
    await localforage.removeItem(getNoteKey(noteId));
  }

  // Notes list operations
  async getNotesList(): Promise<Note[]> {
    const notesList = await localforage.getItem<Note[]>(StorageKey.NOTES_LIST);
    return notesList || [];
  }

  async saveNotesList(notes: Note[]): Promise<void> {
    await localforage.setItem(StorageKey.NOTES_LIST, notes);
  }

  async updateNoteInList(note: Note): Promise<Note[]> {
    const notesList = await this.getNotesList();
    const existingIndex = notesList.findIndex(n => n.id === note.id);
    
    if (existingIndex >= 0) {
      notesList[existingIndex] = note;
    } else {
      notesList.push(note);
    }

    await this.saveNotesList(notesList);
    return notesList;
  }

  async deleteNoteFromList(noteId: string): Promise<Note[]> {
    const notesList = await this.getNotesList();
    const updatedList = notesList.filter(n => n.id !== noteId);
    await this.saveNotesList(updatedList);
    return updatedList;
  }

  // GitHub token operations
  async getGithubToken(): Promise<string | null> {
    return await localforage.getItem<string>(StorageKey.GITHUB_TOKEN);
  }

  async saveGithubToken(token: string): Promise<void> {
    await localforage.setItem(StorageKey.GITHUB_TOKEN, token);
  }

  async deleteGithubToken(): Promise<void> {
    await localforage.removeItem(StorageKey.GITHUB_TOKEN);
  }

  // Clear all storage
  async clearAll(): Promise<void> {
    await localforage.clear();
  }
}

export const storageService = new LocalStorageService();
