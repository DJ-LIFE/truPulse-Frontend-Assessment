"use client";
import { Button } from "@/components/Button";
import { addNote } from "@/lib/db";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ReactMde from "react-mde";
import ReactMarkDown from "react-markdown";

const NewNote = () => {
	const [data, setData] = useState({
		title: "",
		content: "",
	});
	const [error, setError] = useState<string | null>(null);
	const [selectedTab, setSelectedTab] = useState<"write" | "preview">(
		"write"
	);
	const router = useRouter();
	const handleSave = async () => {
		if (!data.title.trim()) {
			setError("Please Enter Title");
			return;
		} else if (!data.content.trim()) {
			setError("Content cannot be Empty");
			return;
		}

		try {
			await addNote({
				title: data.title,
				content: data.content,
				updatedAt: new Date().toISOString(),
				synced: 0,
			});
			router.push("/");
		} catch (error) {
			console.log("Failed to Save", error);
			setError("Failed to Save note");
		}
	};
	return (
		<div className="container mx-auto p-4">
			<p className="text-center py-1 px-4 text-red-500 text-xs">
				{error}
			</p>
			<h1 className="text-2xl font-bold mb-6">New Note</h1>
			<div className="mb-4">
				<label className="block mb-2 text-sm font-medium text-gray-900">
					Title
				</label>
				<input
					type="text"
					placeholder="Enter Title..."
					value={data.title}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
						setData({ ...data, title: e.target.value })
					}
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
						onChange={(value) =>
							setData({ ...data, content: value })
						}
						selectedTab={selectedTab}
						onTabChange={setSelectedTab}
						generateMarkdownPreview={(markdown) =>
							Promise.resolve(
								<ReactMarkDown>{markdown}</ReactMarkDown>
							)
						}
						classes={{
							reactMde: "border-none w-full",
							toolbar: "bg-gray-50 border-b border-gray-200 h-10 p-2 rounded-md",
							textArea:
								"w-full bg-white rounded-md shadow-md mt-2 min-h-[200px] p-3 focus:ring-2 focus:ring-blue-500 outline-none",
							preview: "p-3 min-h-[200px] bg-white overflow-auto",
							
						}}
					/>
				</div>
			</div>
			<div className="flex gap-4">
				<Button
					onClick={handleSave}
					className="bg-blue-500 text-white px-4 py-2 rounded"
				>
					Save Note
				</Button>
				<Button
					onClick={() => router.push("/")}
					className="border px-4 py-2 rounded"
				>
					Cancel
				</Button>
			</div>
		</div>
	);
};

export default NewNote;
