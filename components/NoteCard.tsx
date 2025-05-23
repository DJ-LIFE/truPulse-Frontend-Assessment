import { Note } from "@/lib/db";
const NoteCard = ({ title, content, updatedAt, synced }: Note) => {
	return <div className="flex flex-col items-center gap-4 border-neutral-200 rounded-md">
        <h5>{title}</h5>
        <p>{content}</p>
    </div>;
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
