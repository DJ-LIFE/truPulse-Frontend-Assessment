import axios from "axios";
import { Note } from "./db";

const API_URL = "https://682f23ae746f8ca4a480046d.mockapi.io/api/v1/notes";

export const fetchNotes = async () => {
	const response = await axios.get<Note[]>(API_URL);
	return response.data;
};
export const createNote = async (note: Partial<Note>) => {
	const response = await axios.post<Note>(API_URL, note);
	return response.data;
};

export const updateNoteOnServer = async (note: Note) => {
	const { synced, ...noteData } = note;

	try {
		// Try to update the note
		const response = await axios.put<Note>(
			`${API_URL}/${note.id}`,
			noteData
		);
		return response.data;
	} catch (error: any) {
		// If we get a 404, the note doesn't exist on the server yet
		if (error.response && error.response.status === 404) {
			console.log(
				`Note ${note.id} not found on server, creating it instead`
			);
			// Create the note if it doesn't exist
			const createResponse = await axios.post<Note>(API_URL, {
				...noteData,
			});
			return createResponse.data;
		}
		// Re-throw other errors
		throw error;
	}
};

export const deleteNoteFromServer = async (id: string) => {
	await axios.delete(`${API_URL}/${id}`);
	return id;
};
