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
	notes: "++id, title, content, updatedAt, synced",
});

export type { Note };
export { db };
