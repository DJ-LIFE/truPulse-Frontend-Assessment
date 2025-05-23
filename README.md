# TruPulse Notes - Offline-First Markdown Notes App

[![Next.js](https://img.shields.io/badge/Next.js-15.3.2-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue?style=flat&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38b2ac?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Dexie.js](https://img.shields.io/badge/Dexie.js-4.0.11-orange?style=flat)](https://dexie.org/)

TruPulse Notes is an offline-first Markdown-based notes application that allows users to create, edit, and delete notes even without an internet connection. When connectivity is restored, the app automatically syncs all pending changes to the backend.

## 🚀 Features

-   **Offline-First**: Create, edit, and delete notes without an internet connection
-   **Markdown Support**: Full Markdown editing capabilities with live preview
-   **Auto-Sync**: Automatic synchronization with backend when online
-   **Connectivity Detection**: Visual indicators of online/offline status
-   **Sync Status**: Each note shows its sync status (synced/unsynced)
-   **Search**: Filter notes by title or content
-   **Autosave**: Changes are automatically saved as you type (debounced)
-   **Responsive Design**: Works well on desktop and mobile devices

## 🛠️ Technology Stack

-   **Frontend**: React 19 with Next.js 15.3
-   **Styling**: TailwindCSS 4
-   **Local Database**: IndexedDB (via Dexie.js)
-   **Markdown Editor**: react-mde
-   **Markdown Rendering**: react-markdown
-   **API Communication**: Axios
-   **UUID Generation**: Native Web Crypto API
-   **Debouncing**: Lodash

## 🏗️ Architecture & Design Decisions

### Data Flow

1. **Local-First Storage**: All data is first stored in IndexedDB for immediate access
2. **Background Sync**: When online, data is synchronized with the backend API
3. **Conflict Resolution**: Last-write-wins strategy with timestamps for conflict resolution

### Offline Strategy

-   **Connectivity Detection**: Combination of `navigator.onLine` and network tests
-   **Sync Queue**: Unsynced notes are tracked and synced when online
-   **Initial Sync**: Fetches all notes from server at app startup when online

### Sync Process

1. **Detect Connection**: Identify if device has internet connectivity
2. **Find Unsynced Notes**: Query IndexedDB for notes with `synced: 0`
3. **Server Reconciliation**: Compare with server state to determine create/update/delete operations
4. **Sync and Mark**: Update server and mark notes as synced after successful sync

## 🔄 Sync & Conflict Resolution

The app uses a client-wins strategy for conflict resolution:

1. **Initial Sync**: On app load, we fetch all server notes and compare with local
2. **Local Priority**: Local changes are tracked with `synced: 0` flag and pushed to server
3. **Timestamps**: `updatedAt` timestamps are used to resolve conflicts

## 📦 Getting Started

### Prerequisites

-   Node.js 18+ and npm/yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/tru-pulse-assessment.git
cd tru-pulse-assessment

# Install dependencies
npm install
# or
yarn install

# Start the development server
npm run dev
# or
yarn dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm run start
# or
yarn build
yarn start
```

## 🧪 Testing Offline Mode

You can test the offline functionality using browser DevTools:

1. Open the application in your browser
2. Open DevTools (F12 or Ctrl+Shift+I / Cmd+Option+I)
3. Go to Network tab
4. Check the "Offline" checkbox
5. Create, edit, or delete notes
6. Uncheck "Offline" to see synchronization occur

## 📝 API Endpoints

The app uses a mock API with the following endpoints:

-   `GET /notes` - Fetch all notes
-   `POST /notes` - Create a new note
-   `PUT /notes/:id` - Update a note
-   `DELETE /notes/:id` - Delete a note

## 🔍 Project Structure

```
app/                   # Next.js app directory (route based)
├── layout.tsx         # Root layout
├── page.tsx           # Home page (note listing)
└── notes/             # Notes routes
    ├── [id]/page.tsx  # Note editing page
    └── new/page.tsx   # Create new note page
components/            # Reusable UI components
├── Button.tsx         # Button component
├── ConnectionStatus.tsx # Online/offline indicator
├── NoteCard.tsx       # Note card component
└── SearchQuery.tsx    # Search input component
hooks/                 # Custom React hooks
└── useOnlineStatus.ts # Hook for detecting online/offline state
lib/                   # Core functionality
├── api.ts             # API client
├── db.ts              # IndexedDB operations with Dexie
└── syncService.ts     # Sync logic between local DB and API
```

## 🌟 Advanced Features

-   **Real Connectivity Detection**: Beyond standard online/offline events
-   **Efficient Syncing**: Only sync notes that have been modified
-   **Full-Text Search**: Search within note titles and content

## 🔧 Implementation Details

### Data Model

```typescript
interface Note {
	id: string; // Unique UUID
	title: string; // Note title
	content: string; // Markdown text content
	updatedAt: string; // ISO timestamp of last update
	synced: number; // 0 for unsynced, 1 for synced
}
```

### IndexedDB Schema

The app uses Dexie.js to interact with IndexedDB. The database schema is:

```typescript
db.version(1).stores({
	notes: "id, title, content, updatedAt, synced",
});
```

### Connectivity Detection

The app uses a combination of browser APIs and network requests to reliably detect connectivity:

```typescript
// Standard API
window.addEventListener("online", handleOnline);
window.addEventListener("offline", handleOffline);

// Network request to verify actual connectivity
const checkOnlineStatus = async () => {
	try {
		const response = await fetch("/favicon.ico", {
			method: "HEAD",
			cache: "no-store",
			signal: AbortSignal.timeout(2000),
		});
		setIsOnline(response.ok);
	} catch (error) {
		setIsOnline(false);
	}
};
```

### Syncing Mechanism

The sync process follows these steps:

1. Check if the device is truly online
2. Fetch all unsynced notes from IndexedDB
3. For each unsynced note:
    - Check if it exists on the server
    - Create or update accordingly
    - Mark as synced after successful API call
4. Return a summary of the sync operation

```typescript
export const syncNotes = async () => {
	// Check connectivity
	if (!navigator.onLine) return { success: false, message: "Offline" };

	// Get unsynced notes
	const unsyncedNotes = await getUnsyncedNotes();

	// Get server notes to compare
	const serverNotes = await api.fetchNotes();
	const serverNoteIds = new Set(serverNotes.map((note) => note.id));

	// Sync each note
	for (const note of unsyncedNotes) {
		if (serverNoteIds.has(note.id)) {
			await api.updateNoteOnServer(note);
		} else {
			await api.createNote(note);
		}
		await markNoteSynced(note.id);
	}
};
```

## ⚠️ Assumptions & Limitations

1. **Authentication**: This implementation doesn't include user authentication
2. **Conflict Resolution**: Uses simple last-write-wins without manual conflict resolution UI
3. **Complex Sync**: No handling of conflicts requiring three-way merges
4. **Backend Stability**: Assumes the backend API is reliable and follows REST conventions
5. **Data Volume**: Designed for a reasonable number of notes, not optimized for thousands

## 🔮 Future Improvements

-   **User Authentication**: Add multi-user support
-   **Note Categories/Tags**: Organize notes with categories or tags
-   **Conflict Resolution UI**: Allow users to manually resolve sync conflicts
-   **Full PWA Support**: Add service worker for complete offline mode
-   **End-to-End Encryption**: Add client-side encryption for private notes
-   **Improved Editor**: Rich text editing capabilities
-   **Sync History**: View and restore previous versions of notes

## 📜 License

MIT

---

This project was created as a take-home assignment demonstrating offline-first application development with React and IndexedDB.
