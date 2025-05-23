"use client";
import NoteCard from "@/components/NoteCard";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { getAllNotes, Note } from "@/lib/db";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
	const [notes, setNotes] = useState<Note[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	useEffect(() => {
		const loadNotes = async () => {
			try {
				const allNotes = await getAllNotes();
				setNotes(allNotes);
			} catch (error) {
			} finally {
				setIsLoading(false);
			}
		};
		loadNotes();
	}, []);


	return (
		<div className="flex justify-center items-center">
			{isLoading ? (
				<div className="h-screen mt-40">Loading...</div>
			) : notes.length > 0 ? (
				<div>
					{notes.map((note) => (
						<NoteCard key={note.id} {...note} />
					))}
				</div>
			) : (
				<button
					type="button"
					className="cursor-pointer focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
				>
					Create Note{" "}
					<span>
						<Plus />
					</span>
				</button>
			)}
		</div>
	);
}
