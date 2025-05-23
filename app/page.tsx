"use client";
import { Button } from "@/components/Button";
import NoteCard from "@/components/NoteCard";
import SearchQuery from "@/components/SearchQuery";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { deleteNote, getAllNotes, Note } from "@/lib/db";
import { initialSync, syncNotes } from "@/lib/syncService";
import { CircleX, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
	}, []);

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

	// First filter by UUID pattern, then by search query
	const uuidPattern =
		/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
	const uuidNotes = notes.filter((note) =>
		uuidPattern.test(note.id.toString())
	);

	const filteredNotes = uuidNotes.filter(
		(note) =>
			note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			note.content.toLowerCase().includes(searchQuery.toLowerCase())
	);
	console.log(filteredNotes, "filtered notes");
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
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					{filteredNotes.map((note) => (
						<div
							className="relative flex justify-center bg-gradient-to-br from-pink-100 via-yello-100 m-2 to-violet-100 border border-neutral-300 w-full mt-10 shadow-lg rounded-2xl hover:scale-105 hover:transition-all hover:duration-300"
							key={note.id}
						>
							<NoteCard key={note.id} {...note} />
							<span
								className="absolute text-red-500 text-xs font-semibold cursor-pointer right-2 top-2 "
								onClick={async () => {
									await deleteNote(note.id);
									refreshNotes(); // Refresh notes after deletion
								}}
							>
								<CircleX />
							</span>
						</div>
					))}
				</div>
			) : (
				<Link href={`/notes/new`}>
					<Button className="flex">
						Create Note
					</Button>
				</Link>
			)}
			{filteredNotes.length > 0 && (
				<Button
					onClick={() => router.push("/notes/new")}
				>
					Create Note Note{" "}
				</Button>
			)}
		</div>
	);
}
