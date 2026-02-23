import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { LocalStorageService } from '../services/localStorage.service';
import { StorageKey, Note } from '../types';

// Mock localforage
vi.mock('localforage', () => ({
  default: {
    config: vi.fn(),
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
}));

// Import after mock
import localforage from 'localforage';

describe('LocalStorageService', () => {
  let service: LocalStorageService;
  const mockNote: Note = {
    id: 'test-id',
    content: '# Test Note',
    updatedAt: '2026-02-23T00:00:00.000Z',
    title: 'Test Note'
  };

  beforeEach(() => {
    service = new LocalStorageService();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('Note operations', () => {
    it('should save a note', async () => {
      await service.saveNote(mockNote);
      expect(localforage.setItem).toHaveBeenCalledWith('note_test-id', mockNote);
    });

    it('should get a note', async () => {
      (localforage.getItem as any).mockResolvedValue(mockNote);
      const result = await service.getNote('test-id');
      expect(localforage.getItem).toHaveBeenCalledWith('note_test-id');
      expect(result).toEqual(mockNote);
    });

    it('should delete a note', async () => {
      await service.deleteNote('test-id');
      expect(localforage.removeItem).toHaveBeenCalledWith('note_test-id');
    });
  });

  describe('Notes list operations', () => {
    it('should get notes list', async () => {
      const mockNotes = [mockNote];
      (localforage.getItem as any).mockResolvedValue(mockNotes);
      
      const result = await service.getNotesList();
      
      expect(localforage.getItem).toHaveBeenCalledWith(StorageKey.NOTES_LIST);
      expect(result).toEqual(mockNotes);
    });

    it('should return empty array when notes list is null', async () => {
      (localforage.getItem as any).mockResolvedValue(null);
      
      const result = await service.getNotesList();
      
      expect(result).toEqual([]);
    });

    it('should save notes list', async () => {
      const mockNotes = [mockNote];
      await service.saveNotesList(mockNotes);
      expect(localforage.setItem).toHaveBeenCalledWith(StorageKey.NOTES_LIST, mockNotes);
    });

    it('should update existing note in list', async () => {
      const existingNotes = [{ ...mockNote, title: 'Old Title' }];
      const updatedNote = { ...mockNote, title: 'New Title' };
      
      (localforage.getItem as any).mockResolvedValue(existingNotes);
      
      const result = await service.updateNoteInList(updatedNote);
      
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('New Title');
      expect(localforage.setItem).toHaveBeenCalledWith(StorageKey.NOTES_LIST, result);
    });

    it('should add new note to list when not exists', async () => {
      const existingNotes: Note[] = [];
      
      (localforage.getItem as any).mockResolvedValue(existingNotes);
      
      const result = await service.updateNoteInList(mockNote);
      
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(mockNote);
      expect(localforage.setItem).toHaveBeenCalledWith(StorageKey.NOTES_LIST, result);
    });

    it('should delete note from list', async () => {
      const existingNotes = [mockNote, { ...mockNote, id: 'other-id' }];
      
      (localforage.getItem as any).mockResolvedValue(existingNotes);
      
      const result = await service.deleteNoteFromList('test-id');
      
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('other-id');
      expect(localforage.setItem).toHaveBeenCalledWith(StorageKey.NOTES_LIST, result);
    });
  });

  describe('GitHub token operations', () => {
    it('should get GitHub token', async () => {
      const mockToken = 'ghp_test123';
      (localforage.getItem as any).mockResolvedValue(mockToken);
      
      const result = await service.getGithubToken();
      
      expect(localforage.getItem).toHaveBeenCalledWith(StorageKey.GITHUB_TOKEN);
      expect(result).toBe(mockToken);
    });

    it('should save GitHub token', async () => {
      const mockToken = 'ghp_test123';
      await service.saveGithubToken(mockToken);
      expect(localforage.setItem).toHaveBeenCalledWith(StorageKey.GITHUB_TOKEN, mockToken);
    });

    it('should delete GitHub token', async () => {
      await service.deleteGithubToken();
      expect(localforage.removeItem).toHaveBeenCalledWith(StorageKey.GITHUB_TOKEN);
    });
  });

  describe('Clear all', () => {
    it('should clear all storage', async () => {
      await service.clearAll();
      expect(localforage.clear).toHaveBeenCalled();
    });
  });
});
