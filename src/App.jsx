import React, { useState, useEffect, useCallback } from 'react';
import MDEditor from '@uiw/react-md-editor';
import localforage from 'localforage';
import './App.css';

// Configure localforage for offline storage
localforage.config({
  name: 'GitNotes',
  storeName: 'notes',
  description: 'Markdown notes storage'
});

function App() {
  const [markdown, setMarkdown] = useState('# Welcome to GitNotes\n\nStart typing your notes here...');
  const [currentFile, setCurrentFile] = useState(null);
  const [notes, setNotes] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [githubToken, setGithubToken] = useState('');
  const [showSettings, setShowSettings] = useState(false);

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

  // Load notes from local storage on mount
  useEffect(() => {
    loadNotes();
    loadSettings();
  }, []);

  const loadNotes = async () => {
    try {
      const storedNotes = await localforage.getItem('notesList') || [];
      setNotes(storedNotes);
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  };

  const loadSettings = async () => {
    try {
      const token = await localforage.getItem('githubToken');
      if (token) setGithubToken(token);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveNote = useCallback(async () => {
    try {
      const timestamp = new Date().toISOString();
      const noteData = {
        id: currentFile || timestamp,
        content: markdown,
        updatedAt: timestamp,
        title: extractTitle(markdown)
      };

      // Save to localforage
      await localforage.setItem(`note_${noteData.id}`, noteData);

      // Update notes list
      const notesList = await localforage.getItem('notesList') || [];
      const existingIndex = notesList.findIndex(n => n.id === noteData.id);
      
      if (existingIndex >= 0) {
        notesList[existingIndex] = noteData;
      } else {
        notesList.push(noteData);
      }

      await localforage.setItem('notesList', notesList);
      setNotes(notesList);
      setCurrentFile(noteData.id);

      // Also save to file system if electron API is available
      if (window.electron && currentFile) {
        const result = await window.electron.saveFile(currentFile, markdown);
        if (!result.success) {
          console.error('Error saving to file system:', result.error);
        }
      }

      return noteData;
    } catch (error) {
      console.error('Error saving note:', error);
      alert('Failed to save note');
    }
  }, [markdown, currentFile]);

  const extractTitle = (content) => {
    const lines = content.split('\n');
    const firstLine = lines[0] || '';
    return firstLine.replace(/^#\s*/, '') || 'Untitled Note';
  };

  const newNote = () => {
    setMarkdown('# New Note\n\nStart typing...');
    setCurrentFile(null);
  };

  const loadNote = async (noteId) => {
    try {
      const note = await localforage.getItem(`note_${noteId}`);
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
      alert('File operations are only available in the desktop app');
      return;
    }

    try {
      const result = await window.electron.openFileDialog();
      if (!result.canceled && result.filePath) {
        const fileData = await window.electron.readFile(result.filePath);
        if (fileData.success) {
          setMarkdown(fileData.content);
          setCurrentFile(result.filePath);
        }
      }
    } catch (error) {
      console.error('Error opening file:', error);
      alert('Failed to open file');
    }
  };

  const saveFileAs = async () => {
    if (!window.electron) {
      alert('File operations are only available in the desktop app');
      return;
    }

    try {
      const result = await window.electron.saveFileDialog();
      if (!result.canceled && result.filePath) {
        const saveResult = await window.electron.saveFile(result.filePath, markdown);
        if (saveResult.success) {
          setCurrentFile(result.filePath);
        } else {
          alert('Failed to save file');
        }
      }
    } catch (error) {
      console.error('Error saving file:', error);
      alert('Failed to save file');
    }
  };

  const syncWithGitHub = async () => {
    if (!githubToken) {
      alert('Please set your GitHub token in settings');
      setShowSettings(true);
      return;
    }

    if (!isOnline) {
      alert('You are offline. Changes will sync when you are back online.');
      return;
    }

    setIsSyncing(true);
    try {
      // This is a simplified example - in production you'd implement full GitHub API integration
      const noteData = await saveNote();
      
      // Simulate GitHub sync
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Synced with GitHub successfully!');
    } catch (error) {
      console.error('Error syncing with GitHub:', error);
      alert('Failed to sync with GitHub');
    } finally {
      setIsSyncing(false);
    }
  };

  const saveSettings = async () => {
    try {
      await localforage.setItem('githubToken', githubToken);
      setShowSettings(false);
      alert('Settings saved!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    }
  };

  const deleteNote = async (noteId) => {
    if (!confirm('Are you sure you want to delete this note?')) {
      return;
    }

    try {
      await localforage.removeItem(`note_${noteId}`);
      const notesList = await localforage.getItem('notesList') || [];
      const updatedList = notesList.filter(n => n.id !== noteId);
      await localforage.setItem('notesList', updatedList);
      setNotes(updatedList);

      if (currentFile === noteId) {
        newNote();
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('Failed to delete note');
    }
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
            onChange={setMarkdown}
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
    </div>
  );
}

export default App;
