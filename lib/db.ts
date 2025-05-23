import Dexie, { type EntityTable } from "dexie";

interface Note {
	id: string;
	title: string;
	content: string;
	updatedAt: string;
	synced: boolean;
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
		synced: false,
	});
};

export const updateNote = async (
	id: string,
	changes: Partial<Omit<NonElementParentNode, "id">>
) => {
	await db.notes.update(id, {
		...changes,
		updatedAt: new Date().toISOString(),
		synced: false,
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
	return await db.notes.update(id, { synced: true });
};

export type { Note };
export { db };
