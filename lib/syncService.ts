import * as api from "./api";
import { db, getAllNotes, getUnsyncedNotes, markNoteSynced } from "./db";

// Helper function to check real connectivity by making a test request
const checkRealConnectivity = async (): Promise<boolean> => {
	try {
		const response = await fetch("/favicon.ico", {
			method: "HEAD",
			cache: "no-store",
			signal: AbortSignal.timeout(3000),
		});
		return response.ok;
	} catch (error) {
		console.log("Connectivity check failed:", error);
		return false;
	}
};

export const syncNotes = async () => {
	if (!navigator.onLine) return { success: false, message: "Offline" };

	const isReallyOnline = await checkRealConnectivity();
	if (!isReallyOnline)
		return { success: false, message: "No connectivity detected" };
	try {
		const unsyncedNotes = await getUnsyncedNotes();
		console.log(`Found ${unsyncedNotes.length} unsynced notes to sync`);

		let syncedCount = 0;
		let errorCount = 0;

		// First, fetch all notes from the server to check what exists
		const serverNotes = await api.fetchNotes();
		const serverNoteIds = new Set(serverNotes.map((note) => note.id));

		for (const note of unsyncedNotes) {
			try {
				console.log(`Syncing note: ${note.id} - ${note.title}`);

				// If the note exists on the server, update it
				if (serverNoteIds.has(note.id)) {
					await api.updateNoteOnServer(note);
				} else {
					// If the note doesn't exist on the server, create it
					await api.createNote({
						id: note.id,
						title: note.title,
						content: note.content,
						updatedAt: note.updatedAt,
					});
				}

				await markNoteSynced(note.id);
				syncedCount++;
			} catch (error) {
				console.error(`Failed to sync Note ${note.id}:`, error);
				errorCount++;
				// Don't mark as synced if there was an error
			}
		}

		return {
			success: true,
			syncedCount,
			errorCount,
			message:
				syncedCount > 0
					? `Synced ${syncedCount} notes`
					: "No notes needed syncing",
		};
	} catch (error) {
		console.log("Sync failed", error);
		return { success: false, message: "Sync Error" };
	}
};

export const initialSync = async () => {
	if (!navigator.onLine) return;

	const isReallyOnline = await checkRealConnectivity();
	if (!isReallyOnline) return;

	try {
		const serverNotes = await api.fetchNotes();
		const localNotes = await getAllNotes();

		const localNotesMap = new Map(
			localNotes.map((note) => [note.id, note])
		);

		for (const serverNote of serverNotes) {
			const localNote = localNotesMap.get(serverNote.id);

			if (!localNote) {
				await db.notes.add({
					...serverNote,
					synced: 1,
				});
			} else {
				if (
					localNote.synced &&
					new Date(serverNote.updatedAt) >
						new Date(localNote.updatedAt)
				) {
					await db.notes.update(localNote.id, {
						...serverNote,
						synced: 1,
					});
				}
			}
		}
	} catch (error) {
		console.error("initail Sync Failed", error);
	}
};
