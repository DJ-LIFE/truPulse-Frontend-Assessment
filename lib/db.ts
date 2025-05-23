import Dexie, { type EntityTable } from "dexie";

interface Note {
	id: string;
	title: string;
	content: string;
	updatedAt: string;
	synced: number; // Use 0 for false, 1 for true to make it indexable
}

const db = new Dexie("notesdb") as Dexie & {
	notes: EntityTable<Note, "id">;
};

db.version(1).stores({
	notes: "id, title, content, updatedAt, synced",
});

export const getAllNotes = async () => {
	return await db.notes.orderBy("updatedAt").reverse().toArray();
};

export const getNote = async (id: string) => {
	return await db.notes.get(id);
};

export const addNote = async (note: Omit<Note, "id">) => {
	const id = crypto.randomUUID();
	return await db.notes.add({
		id,
		...note,
		updatedAt: new Date().toISOString(),
		synced: 0,
	});
};

export const updateNote = async (
	id: string,
	changes: Partial<Omit<Note, "id">>
) => {
	// Only mark as unsynced if content or title changes
	const needsSync =
		changes.title !== undefined || changes.content !== undefined;

	await db.notes.update(id, {
		...changes,
		updatedAt: new Date().toISOString(),
		...(needsSync ? { synced: 0 } : {}), // Only update synced status if needed
	});
	return await getNote(id);
};

export const deleteNote = async (id: string) => {
	return await db.notes.delete(id);
};

// Getting all unsynced notes
export const getUnsyncedNotes = async () => {
	return await db.notes.where("synced").equals(0).toArray();
};

export const markNoteSynced = async (id: string) => {
	return await db.notes.update(id, { synced: 1 });
};

export const isSynced = (note: Note): boolean => {
	return note.synced === 1;
};

export type { Note };
export { db };
