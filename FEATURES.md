# GitNotes Features

## Core Features

### 1. Markdown Editing
- **Live Preview**: See your markdown rendered in real-time as you type
- **Full Markdown Support**: Headers, lists, code blocks, links, images, and more
- **Split View**: Edit and preview side-by-side
- **Syntax Highlighting**: Code blocks with syntax highlighting

### 2. Local Storage
- **IndexedDB Storage**: Fast and reliable local storage using localforage
- **Auto-save**: Notes are automatically saved to local storage
- **Persistent Data**: Your notes persist across sessions
- **No Data Loss**: Works completely offline with no internet required

### 3. File System Integration
- **Open Markdown Files**: Load `.md` files from your file system
- **Save As**: Export notes as `.md` files to any location
- **Native File Dialogs**: MacOS-native file picker dialogs
- **File Watching**: Current file state tracking

### 4. GitHub Integration (Planned)
- **OAuth Authentication**: Secure GitHub authentication
- **Token Storage**: Safely store GitHub personal access tokens
- **Sync to Repository**: Push notes to GitHub repositories
- **Conflict Resolution**: Handle sync conflicts intelligently
- **Branch Support**: Work with different branches

### 5. Offline Support
- **Offline Detection**: Automatically detects internet connectivity
- **Status Indicator**: Visual indicator showing online/offline status
- **Queue Operations**: Sync operations queued when offline
- **Auto-sync**: Automatically sync when connection is restored
- **No Interruption**: Continue working seamlessly when offline

### 6. User Interface
- **Dark Theme**: Easy on the eyes with a professional dark theme
- **Minimalist Design**: Clean interface to minimize distractions
- **Sidebar Navigation**: Quick access to all your notes
- **Keyboard Shortcuts**: Efficient workflow with keyboard shortcuts
- **MacOS Optimized**: Native MacOS window styling and behaviors

## Planned Features

### Coming Soon
- [ ] GitHub repository browser
- [ ] Full GitHub OAuth integration
- [ ] Automatic background sync
- [ ] Multiple theme support (light/dark)
- [ ] Export to PDF
- [ ] Search across all notes
- [ ] Tags and categories
- [ ] Note templates
- [ ] Keyboard shortcut customization
- [ ] Multiple window support

### Future Enhancements
- [ ] Real-time collaboration
- [ ] Encrypted notes
- [ ] Mobile app sync
- [ ] Plugin system
- [ ] Custom CSS themes
- [ ] Git history viewer
- [ ] Diff viewer for changes
- [ ] Merge conflict UI

## Technical Implementation

### Architecture
- **Electron Main Process**: Handles system-level operations, file I/O, and window management
- **React Renderer**: UI layer with component-based architecture
- **IPC Bridge**: Secure communication between main and renderer processes
- **LocalForage**: Abstraction layer over IndexedDB for storage

### Security
- **Context Isolation**: Renderer process is isolated from Node.js
- **Preload Script**: Safe API exposure via contextBridge
- **No Node Integration**: Renderer doesn't have direct Node.js access
- **Secure Token Storage**: GitHub tokens stored in encrypted local storage

### Performance
- **Vite Build**: Fast development and optimized production builds
- **Code Splitting**: Lazy loading for optimal performance
- **Minimal Bundle**: Only essential dependencies included
- **Fast Startup**: Quick app launch and initialization

## Usage Examples

### Creating a New Note
1. Click the "➕ New" button in the toolbar
2. Start typing in the markdown editor
3. Note is automatically saved to local storage

### Opening a File
1. Click "📁 Open" in the toolbar
2. Select a `.md` file from your file system
3. File content loads in the editor

### Syncing with GitHub
1. Click "⚙️ Settings"
2. Enter your GitHub Personal Access Token
3. Save settings
4. Click "🔄 Sync" to sync your notes

### Working Offline
1. GitNotes automatically detects when you're offline
2. All changes are saved locally
3. Sync button will be disabled when offline
4. When back online, click sync to push changes

## Keyboard Shortcuts (Planned)

- `Cmd+N` - New note
- `Cmd+O` - Open file
- `Cmd+S` - Save note
- `Cmd+Shift+S` - Save as
- `Cmd+P` - Preview toggle
- `Cmd+/` - Toggle sidebar
- `Cmd+,` - Settings

## Markdown Syntax Support

GitNotes supports standard markdown syntax including:

- Headers: `# H1`, `## H2`, `### H3`, etc.
- Bold: `**bold**` or `__bold__`
- Italic: `*italic*` or `_italic_`
- Links: `[text](url)`
- Images: `![alt](url)`
- Code: `` `code` `` or ``` for blocks
- Lists: `-` or `*` for unordered, `1.` for ordered
- Blockquotes: `> quote`
- Tables: Using pipe syntax
- Task lists: `- [ ]` and `- [x]`
