"use client";
import { Button } from "@/components/Button";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { deleteNote, getNote, Note, updateNote } from "@/lib/db";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ReactMde from "react-mde";
import ReactMarkDown from "react-markdown";
import debounce from "lodash/debounce";
import { syncNotes } from "@/lib/syncService";

const page = () => {
	const [note, setNote] = useState<Note | null>(null);
	const [data, setData] = useState({
		title: "",
		content: "",
	});
	const [isLoading, setIsLoading] = useState(true);
	const [selectedTab, setSelectedTab] = useState<"write" | "preview">(
		"write"
	);
	const [error, setError] = useState<String | null>(null);
	const isOnline = useOnlineStatus();
	const router = useRouter();
	const params = useParams();
	const id = params.id as string;

	useEffect(() => {
		const loadNote = async () => {
			try {
				const fetchedNote = await getNote(id);
				if (fetchedNote) {
					setNote(fetchedNote);
					setData({
						...data,
						title: fetchedNote.title,
						content: fetchedNote.content,
					});
				} else {
					setError("Error fetching Note");
					router.push("/");
				}
			} catch (error) {
				setError("Failed to load Note");
			} finally {
				setIsLoading(false);
			}
		};
		loadNote();
	}, [id, router]);

	useEffect(() => {
		// Create the debounced save function
		const debouncedSave = debounce(async () => {
			try {
				const updatedNote = await updateNote(id, data);

				if (updatedNote && isOnline) {
					syncNotes();
				}
			} catch (error) {
				console.error("Failed to save note:", error);
			}
		}, 500);

		if (data.title || data.content) {
			debouncedSave();
		}

		return () => {
			debouncedSave.cancel();
		};
	}, [data, id, isOnline]);

	const handleDataChange = (updates: Partial<typeof data>) => {
		setData((prevData) => ({
			...prevData,
			...updates,
		}));
	};

	const handleDelete = async () => {
		if (confirm("Are you sure you want to delete this note?")) {
			try {
				await deleteNote(id);
				router.push("/");
			} catch (error) {
				setError("Failed to Delete");
				console.error("failed to Delete", error);
			}
		}
	};

	if (isLoading) {
		return (
			<div className="container mx-auto p-4 h-full text-sm text-neutral-600 font-semibold">
				Loading Note...
			</div>
		);
	}
	return (
		<div className="container mx-auto p-4">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold"> Edit Note</h1>
				<div
					className={`flex items-center gap-4 ${
						isOnline
							? "bg-green-100 text-green-500"
							: "bg-red-100 text-red-500"
					}`}
				>
					<span
						className={`rounded-full px-4 border ${
							isOnline ? "border-green-500" : "border-red-500"
						}`}
					>
						{isOnline ? "Online" : "Offline"}
					</span>
				</div>
			</div>
			<div className="mb-4">
				<label className="block mb-2 text-sm font-medium text-gray-900">
					Title
				</label>
				<input
					type="text"
					placeholder="Enter Title..."
					value={data.title}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
						handleDataChange({ title: e.target.value });
					}}
					className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500
					 focus:border-blue-500 block w-full p-2.5"
				/>
			</div>
			<div className="mb-6">
				<label className="block mb-2 text-sm font-medium text-gray-900">
					Content
				</label>
				<div className="border border-neutral-400 p-4 rounded-md shadow-md flex justify-between items-center gap-4">
					<ReactMde
						value={data.content}
						onChange={(value) => {
							handleDataChange({ content: value });
						}}
						selectedTab={selectedTab}
						onTabChange={setSelectedTab}
						generateMarkdownPreview={(markdown) =>
							Promise.resolve(
								<ReactMarkDown>{markdown}</ReactMarkDown>
							)
						}
						classes={{
							reactMde: "border-none w-full",
							toolbar:
								"bg-gray-50 border-b border-gray-200 h-10 p-2 rounded-md",
							textArea:
								"w-full bg-white rounded-md shadow-md mt-2 min-h-[200px] p-3 focus:ring-2 focus:ring-blue-500 outline-none",
							preview: "p-3 min-h-[200px] bg-white overflow-auto",
						}}
					/>
				</div>
			</div>
			<div className="flex gap-4">
				<Button
					onClick={() => router.push("/")}
					className="bg-blue-500 text-white px-4 py-2 rounded"
				>
					Back to Notes
				</Button>
				<Button
					onClick={handleDelete}
					className="border px-4 py-2 rounded"
				>
					Delete Note
				</Button>
			</div>
		</div>
	);
};

export default page;
