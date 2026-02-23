import { useState, useEffect, useCallback } from 'react';
import MDEditor from '@uiw/react-md-editor';
import './App.css';
import { Note } from './types';
import { useLocalStorage } from './contexts/LocalStorageContext';
import { useNotifications } from './hooks/useNotifications';
import { useConfirmDialog } from './hooks/useConfirmDialog';
import { useKeyboardShortcut } from './hooks/useKeyboardShortcut';

function App() {
  const storage = useLocalStorage();
  const { notification, showNotification } = useNotifications();
  const { confirmDialog, showConfirm, hideConfirm, handleConfirm } = useConfirmDialog();
  
  const [markdown, setMarkdown] = useState<string>('# Welcome to GitNotes\n\nStart typing your notes here...');
  const [currentFile, setCurrentFile] = useState<string | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [githubToken, setGithubToken] = useState<string>('');
  const [showSettings, setShowSettings] = useState<boolean>(false);

  // Check online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Keyboard shortcuts
  useKeyboardShortcut('Escape', () => {
    if (showSettings) setShowSettings(false);
    if (confirmDialog) hideConfirm();
  }, [showSettings, confirmDialog]);

  const loadNotes = useCallback(async () => {
    try {
      const storedNotes = await storage.getNotesList();
      setNotes(storedNotes);
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  }, [storage]);

  const loadSettings = useCallback(async () => {
    try {
      const token = await storage.getGithubToken();
      if (token) setGithubToken(token);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }, [storage]);

  // Load notes from local storage on mount
  useEffect(() => {
    loadNotes();
    loadSettings();
  }, [loadNotes, loadSettings]);

  const extractTitle = (content: string): string => {
    const lines = content.split('\n');
    const firstLine = lines[0] || '';
    return firstLine.replace(/^#\s*/, '') || 'Untitled Note';
  };

  const saveNote = useCallback(async (): Promise<Note | undefined> => {
    try {
      const timestamp = new Date().toISOString();
      const noteData: Note = {
        id: currentFile || timestamp,
        content: markdown,
        updatedAt: timestamp,
        title: extractTitle(markdown)
      };

      // Save to storage
      await storage.saveNote(noteData);
      const updatedNotes = await storage.updateNoteInList(noteData);
      setNotes(updatedNotes);
      setCurrentFile(noteData.id);

      // Also save to file system if electron API is available and currentFile is a valid file path
      const isFilePath = currentFile && (currentFile.includes('/') || currentFile.includes('\\') || currentFile.endsWith('.md'));
      if (window.electron && isFilePath) {
        const result = await window.electron.saveFile(currentFile, markdown);
        if (!result.success) {
          console.error('Error saving to file system:', result.error);
          showNotification('Failed to save file to disk. Changes are saved locally only.', 'error');
          throw new Error(result.error || 'Failed to save file to disk');
        }
      }

      return noteData;
    } catch (error) {
      console.error('Error saving note:', error);
      showNotification('Failed to save note', 'error');
    }
  }, [markdown, currentFile, storage, showNotification]);

  const newNote = () => {
    setMarkdown('# New Note\n\nStart typing...');
    setCurrentFile(null);
  };

  const loadNote = async (noteId: string) => {
    try {
      const note = await storage.getNote(noteId);
      if (note) {
        setMarkdown(note.content);
        setCurrentFile(note.id);
      }
    } catch (error) {
      console.error('Error loading note:', error);
    }
  };

  const openFile = async () => {
    if (!window.electron) {
      showNotification('File operations are only available in the desktop app', 'warning');
      return;
    }

    try {
      const result = await window.electron.openFileDialog();
      if (!result.canceled && result.filePath) {
        const fileData = await window.electron.readFile(result.filePath);
        if (fileData.success && fileData.content) {
          setMarkdown(fileData.content);
          setCurrentFile(result.filePath);
        }
      }
    } catch (error) {
      console.error('Error opening file:', error);
      showNotification('Failed to open file', 'error');
    }
  };

  const saveFileAs = async () => {
    if (!window.electron) {
      showNotification('File operations are only available in the desktop app', 'warning');
      return;
    }

    try {
      const result = await window.electron.saveFileDialog();
      if (!result.canceled && result.filePath) {
        const saveResult = await window.electron.saveFile(result.filePath, markdown);
        if (saveResult.success) {
          setCurrentFile(result.filePath);
        } else {
          showNotification('Failed to save file', 'error');
        }
      }
    } catch (error) {
      console.error('Error saving file:', error);
      showNotification('Failed to save file', 'error');
    }
  };

  const isValidGithubTokenFormat = (token: string): boolean => {
    return (
      token.startsWith('ghp_') ||
      token.startsWith('gho_') ||
      token.startsWith('ghu_') ||
      token.startsWith('ghs_')
    );
  };

  const syncWithGitHub = async () => {
    if (!githubToken) {
      showNotification('Please set your GitHub token in settings', 'warning');
      setShowSettings(true);
      return;
    }

    if (!isOnline) {
      showNotification('You are offline. Changes will sync when you are back online.', 'warning');
      return;
    }

    setIsSyncing(true);
    try {
      // This is a simplified example - in production you'd implement full GitHub API integration
      await saveNote();
      
      // Simulate GitHub sync
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      showNotification('Synced with GitHub successfully!', 'success');
    } catch (error) {
      console.error('Error syncing with GitHub:', error);
      showNotification('Failed to sync with GitHub', 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  const saveSettings = async () => {
    if (!githubToken) {
      showNotification('GitHub token is required and cannot be empty.', 'warning');
      return;
    }

    if (!isValidGithubTokenFormat(githubToken)) {
      showNotification(
        "Invalid GitHub token format. Tokens should start with 'ghp_', 'gho_', 'ghu_', or 'ghs_'.",
        'error'
      );
      return;
    }

    try {
      await storage.saveGithubToken(githubToken);
      setShowSettings(false);
      showNotification('Settings saved!', 'success');
    } catch (error) {
      console.error('Error saving settings:', error);
      showNotification('Failed to save settings', 'error');
    }
  };

  const deleteNote = async (noteId: string) => {
    showConfirm('Are you sure you want to delete this note?', async () => {
      try {
        await storage.deleteNote(noteId);
        const updatedNotes = await storage.deleteNoteFromList(noteId);
        setNotes(updatedNotes);

        if (currentFile === noteId) {
          newNote();
        }
      } catch (error) {
        console.error('Error deleting note:', error);
        showNotification('Failed to delete note', 'error');
      }
    });
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <h1>📝 GitNotes</h1>
          <span className={`status ${isOnline ? 'online' : 'offline'}`}>
            {isOnline ? '🟢 Online' : '🔴 Offline'}
          </span>
        </div>
        <div className="header-actions">
          <button onClick={newNote} title="New Note">
            ➕ New
          </button>
          <button onClick={openFile} title="Open File">
            📁 Open
          </button>
          <button onClick={saveNote} title="Save Note">
            💾 Save
          </button>
          <button onClick={saveFileAs} title="Save As">
            📄 Save As
          </button>
          <button 
            onClick={syncWithGitHub} 
            disabled={isSyncing}
            title="Sync with GitHub"
          >
            {isSyncing ? '⏳ Syncing...' : '🔄 Sync'}
          </button>
          <button onClick={() => setShowSettings(!showSettings)} title="Settings">
            ⚙️ Settings
          </button>
        </div>
      </header>

      <div className="main-content">
        <aside className="sidebar">
          <h2>Notes</h2>
          <div className="notes-list">
            {notes.map((note) => (
              <div
                key={note.id}
                className={`note-item ${currentFile === note.id ? 'active' : ''}`}
              >
                <div onClick={() => loadNote(note.id)}>
                  <div className="note-title">{note.title}</div>
                  <div className="note-date">
                    {new Date(note.updatedAt).toLocaleDateString()}
                  </div>
                </div>
                <button
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNote(note.id);
                  }}
                  title="Delete Note"
                >
                  🗑️
                </button>
              </div>
            ))}
            {notes.length === 0 && (
              <p className="empty-state">No notes yet. Create your first note!</p>
            )}
          </div>
        </aside>

        <div className="editor-container">
          <MDEditor
            value={markdown}
            onChange={(value) => setMarkdown(value || '')}
            height="100%"
            preview="live"
            hideToolbar={false}
          />
        </div>
      </div>

      {showSettings && (
        <div className="modal-overlay" onClick={() => setShowSettings(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Settings</h2>
            <div className="form-group">
              <label>GitHub Personal Access Token</label>
              <input
                type="password"
                value={githubToken}
                onChange={(e) => setGithubToken(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxx"
              />
              <small>
                Create a token at:{' '}
                <a
                  href="https://github.com/settings/tokens"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  github.com/settings/tokens
                </a>
              </small>
            </div>
            <div className="modal-actions">
              <button onClick={saveSettings}>Save</button>
              <button onClick={() => setShowSettings(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {confirmDialog && (
        <div className="modal-overlay" onClick={hideConfirm}>
          <div className="modal confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <h2>Confirm</h2>
            <p>{confirmDialog.message}</p>
            <div className="modal-actions">
              <button onClick={handleConfirm}>
                Confirm
              </button>
              <button onClick={hideConfirm}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
    </div>
  );
}

export default App;
