import * as api from "./api";
import { db, getAllNotes, getUnsyncedNotes, markNoteSynced } from "./db";

// Helper function to check real connectivity by making a test request
const checkRealConnectivity = async (): Promise<boolean> => {
	try {
		// Try a lightweight request to check connectivity
		// We use a HEAD request to minimize data transfer
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
	// First check navigator.onLine
	if (!navigator.onLine) return { success: false, message: "Offline" };

	// Double-check with a real network request
	const isReallyOnline = await checkRealConnectivity();
	if (!isReallyOnline)
		return { success: false, message: "No connectivity detected" };

	try {
		const unsyncedNotes = await getUnsyncedNotes();

		for (const note of unsyncedNotes) {
			try {
				await api.updateNoteOnServer(note);
				await markNoteSynced(note.id);
			} catch (error) {
				console.error(`Failed to sync Note ${note.id}`, error);
			}
		}

		return { success: true, syncedCount: unsyncedNotes.length };
	} catch (error) {
		console.log("Sync failed", error);
		return { success: false, message: "Sync Error" };
	}
};

export const initialSync = async () => {
	// First check navigator.onLine
	if (!navigator.onLine) return;

	// Double-check with a real network request
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
					synced: true,
				});
			} else {
				if (
					localNote.synced &&
					new Date(serverNote.updatedAt) >
						new Date(localNote.updatedAt)
				) {
					await db.notes.update(localNote.id, {
						...serverNote,
						synced: true,
					});
				}
			}
		}
	} catch (error) {
		console.error("initail Sync Failed", error);
	}
};
