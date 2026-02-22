# GitNotes 📝

GitNotes is an intuitive Electron (React) app built to run on MacOS, designed to help boost software developers' productivity. It features a simple and lightweight interface to allow focus while relying on GitHub's power and safety features.

## Screenshots

![GitNotes Interface](docs/screenshot.png)
*Clean, dark-themed interface with markdown editor and live preview*

## Features ✨

- **Markdown Support**: Full markdown editor with live preview
- **Local Storage**: Store notes locally using IndexedDB (via localforage)
- **File System Integration**: Save and open `.md` files from your local file system
- **GitHub Sync**: Sync your notes with GitHub repositories
- **Offline Support**: Work seamlessly offline with automatic sync when back online
- **Simple UI**: Clean, dark-themed interface optimized for MacOS
- **Lightweight**: Minimal resource usage for maximum productivity

## Installation 🚀

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone https://github.com/gilsonviana/GitNotes.git
cd GitNotes
```

2. Install dependencies:
```bash
npm install
```

3. Run in development mode:
```bash
npm run dev
```

4. Build for MacOS:
```bash
npm run build:mac
```

The built app will be available in the `release` directory.

## Usage 💡

### Creating and Editing Notes

1. Click **"➕ New"** to create a new note
2. Start typing in the markdown editor
3. Click **"💾 Save"** to save your note to local storage

### File Operations

- **Open**: Open existing `.md` files from your file system
- **Save As**: Save the current note as a `.md` file to your file system

### GitHub Sync

1. Click **"⚙️ Settings"**
2. Enter your GitHub Personal Access Token
   - Create one at: https://github.com/settings/tokens
   - Required scopes: `repo` (for private repos) or `public_repo` (for public repos)
3. Click **"🔄 Sync"** to sync your notes with GitHub

### Offline Mode

- GitNotes automatically detects when you're offline
- All changes are saved locally
- Sync with GitHub when you're back online

## Technology Stack 🛠️

- **Electron**: Cross-platform desktop framework
- **React**: UI library for building the interface
- **TypeScript**: Strongly-typed programming language
- **Vite**: Fast build tool and dev server
- **@uiw/react-md-editor**: Markdown editor component
- **localforage**: Offline storage with IndexedDB
- **electron-builder**: Package and build for distribution

## Development 👨‍💻

### Project Structure

```
GitNotes/
├── electron/          # Electron main process
│   ├── main.ts        # Main Electron entry point
│   └── preload.ts     # Preload script for IPC
├── src/               # React application
│   ├── App.tsx        # Main App component
│   ├── App.css        # App styles
│   ├── main.tsx       # React entry point
│   ├── index.css      # Global styles
│   └── vite-env.d.ts  # TypeScript declarations
├── public/            # Static assets
├── index.html         # HTML template
├── vite.config.ts     # Vite configuration
├── tsconfig.json      # TypeScript configuration
└── package.json       # Project dependencies and scripts
```

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the React app
- `npm run build:mac` - Build MacOS application
- `npm run preview` - Preview production build
- `npm run typecheck` - Run TypeScript type checking
- `npm run build` - Build the React app
- `npm run build:mac` - Build MacOS application
- `npm run preview` - Preview production build

## Contributing 🤝

Contributions are welcome! Please feel free to submit a Pull Request.

## License 📄

MIT License - see LICENSE file for details

## Author 👤

Gilson Viana

## Acknowledgments 🙏

- Built with Electron and React
- Markdown editing powered by @uiw/react-md-editor
- Storage powered by localforage