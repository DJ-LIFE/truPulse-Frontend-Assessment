import { Note } from "@/lib/db";
import Link from "next/link";
const NoteCard = ({ id, title, content, updatedAt, synced }: Note) => {
	const truncatedContent =
		content.length > 50 ? content.substring(0, 50) + "..." : content;
	return (
		<Link href={`/notes/${id}`}>
			<div className="flex flex-col items-center gap-4 border-neutral-200 rounded-md pb-20 w-full">
				<div className="w-full flex justify-between items-center">
					<h5 className="text-lg font-bold text-neutral-800">{title.toUpperCase()}</h5>
					<div
						className={`text-xs px-2 py-1 rounded ${
							synced
								? "bg-green-100 text-green-500"
								: "bg-yellow-100 text-yellow-500"
						}`}
						key={id}
					>
						{synced ? "Synced" : "Unsynced"}
					</div>
				</div>
				<p className="text-wrap">{truncatedContent}</p>
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
