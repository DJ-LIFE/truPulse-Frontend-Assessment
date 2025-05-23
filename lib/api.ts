import axios from "axios";
import { Note } from "./db";

const API_URL = "https://682f23ae746f8ca4a480046d.mockapi.io/api/v1/notes";

export const fetchNotes = async () => {
	const response = await axios.get<Note[]>(API_URL);
	return response.data;
};
export const createNote = async (note: Omit<Note, "synced">) => {
	const response = await axios.post<Note>(API_URL, note);
	return response.data;
};

export const updateNoteOnServer = async (note: Note) => {
	const { synced, ...noteData } = note;
	const response = await axios.put<Note>(`${API_URL}/${note.id}`, noteData);
	return response.data;
};

export const deleteNoteFromServer = async (id: string) => {
	await axios.delete(`${API_URL}/${id}`);
	return id;
};
