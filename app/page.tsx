"use client";
import { Button } from "@/components/Button";
import NoteCard from "@/components/NoteCard";
import SearchQuery from "@/components/SearchQuery";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { deleteNote, getAllNotes, Note } from "@/lib/db";
import { initialSync, syncNotes } from "@/lib/syncService";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { InputEvent, useEffect, useState } from "react";

export default function Home() {
	const [notes, setNotes] = useState<Note[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const router = useRouter();
	const isOnline = useOnlineStatus();

	// Load notes only once when component mounts
	useEffect(() => {
		const loadNotes = async () => {
			try {
				const allNotes = await getAllNotes();
				setNotes(allNotes);
			} catch (error) {
				console.error("Failed to load notes:", error);
			} finally {
				setIsLoading(false);
			}
		};
		loadNotes();
	}, []); // Empty dependency array - only run once

	// Create a separate function to refresh notes
	const refreshNotes = async () => {
		try {
			const allNotes = await getAllNotes();
			setNotes(allNotes);
		} catch (error) {
			console.error("Failed to refresh notes:", error);
		}
	};

	// Sync notes when online status changes
	useEffect(() => {
		if (isOnline) {
			syncNotes().then(() => {
				refreshNotes();
			});
		}
	}, [isOnline]);

	useEffect(() => {
		initialSync().then(() => {
			refreshNotes();
		});
	}, []);

	const filteredNotes = notes.filter(
		(note) =>
			note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			note.content.toLowerCase().includes(searchQuery.toLowerCase())
	);
	return (
		<div className="flex flex-col justify-center items-center">
			<div className="p-10">
				<SearchQuery
					value={searchQuery}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
						setSearchQuery(e.target.value)
					}
				/>
			</div>
			{isLoading ? (
				<div className="h-screen mt-40">Loading...</div>
			) : filteredNotes.length > 0 ? (
				<div className="grid grid-cols-3 gap-4">
					{filteredNotes.map((note) => (
						<div
							className="flex justify-center border border-neutral-300 p-4 w-full mt-10 shadow-lg rounded-md"
							key={note.id}
						>
							<NoteCard {...note} />{" "}
							<span
								className="text-red-500 text-xs font-semibold cursor-pointer"
								onClick={async () => {
									await deleteNote(note.id);
									refreshNotes(); // Refresh notes after deletion
								}}
							>
								X
							</span>
						</div>
					))}
				</div>
			) : (
				<Link href={`/notes/new`}>
					<Button>
						Create Note{" "}
						<span>
							<Plus />
						</span>
					</Button>
				</Link>
			)}
			{filteredNotes.length > 0 && (
				<Button
					onClick={() => router.push("/notes/new")}
					className="fixed bottom-10 right-20"
				>
					Create Note Note{" "}
					<span>
						<Plus />
					</span>
				</Button>
			)}
		</div>
	);
}
