import { Search } from "lucide-react";

const SearchQuery = ({
	value,
	onChange,
}: {
	value: string;
	onChange: React.ChangeEventHandler<HTMLInputElement>;
}) => {
	return (
		<div className="w-full relative">
			<input
				type="text"
				placeholder="Search notes..."
				className="pl-6 p-2 border outline:none focus:ring-pink-500 border-pink-500 shadow-md rounded-full bg-pink-200"
				value={value}
				onChange={onChange}
			/>
			<span className="absolute top-[11px] right-3">
				<Search className="w-5 h-5 text-pink-500" />
			</span>
		</div>
	);
};

export default SearchQuery;
