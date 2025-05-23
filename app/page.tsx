"use client";
import { Button } from "@/components/Button";
import NoteCard from "@/components/NoteCard";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { deleteNote, getAllNotes, Note } from "@/lib/db";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
	const [notes, setNotes] = useState<Note[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();
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
	}, [notes]);

	return (
		<div className="flex justify-center items-center">
			{isLoading ? (
				<div className="h-screen mt-40">Loading...</div>
			) : notes.length > 0 ? (
				<div>
					{notes.map((note) => (
						<div className="flex justify-center border border-neutral-300 p-4 mt-10 shadow-lg rounded-md">
							<NoteCard key={note.id} {...note} />{" "}
							<span
								className="text-red-500 text-xs font-semibold cursor-pointer"
								onClick={() => {
									deleteNote(note.id);
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
			<Button onClick={() => router.push("/notes/new")}>
				Create Note Note{" "}
				<span>
					<Plus />
				</span>
			</Button>
		</div>
	);
}
