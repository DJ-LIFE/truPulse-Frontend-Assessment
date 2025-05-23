import { Note } from "@/lib/db";
import Link from "next/link";
const NoteCard = ({ id, title, content, updatedAt, synced }: Note) => {
	const truncatedContent =
		content.length > 50 ? content.substring(0, 50) + "..." : content;
	return (
		<Link href={`/notes/${id}`}>
			<div className="flex flex-col gap-4 border-neutral-200 pb-10 p-8 w-full min-w-70">
				<div className="w-full flex justify-between items-center">
					<h5 className="text-2xl font-bold text-neutral-800">
						{title.toUpperCase()}
					</h5>
					<div
						className={`text-xs font-semibold px-2 py-1 rounded-full border border-green-500 shadow-md ${
							synced === 1
								? "bg-green-100 text-green-500"
								: "bg-yellow-100 text-yellow-500"
						}`}
						key={id}
					>
						{synced === 1 ? "Synced" : "Unsynced"}
					</div>
				</div>
				<p className="text-wrap text-left text-lg font-medium text-neutral-700">{truncatedContent}</p>
			</div>
		</Link>
	);
};

export default NoteCard;
const items = [
	{
		id: 1,
		title: "Go to Gym",
		content: "Go to Gym and Lift weight",
		updatedAt: `${Date.now()}`,
		synced: true,
	},
	{
		id: 2,
		title: "Read a Book",
		content: "Finish reading the current novel",
		updatedAt: `${Date.now() - 100000}`,
		synced: false,
	},
	{
		id: 3,
		title: "Buy Groceries",
		content: "Milk, Bread, Eggs, and Fruits",
		updatedAt: `${Date.now() - 200000}`,
		synced: true,
	},
	{
		id: 4,
		title: "Call Mom",
		content: "Check in and say hello",
		updatedAt: `${Date.now() - 300000}`,
		synced: false,
	},
];
