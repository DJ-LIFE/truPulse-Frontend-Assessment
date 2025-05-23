"use client";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function Home() {
	return (
		<div className="flex justify-center items-center h-screen">
			<button
				type="button"
				className="cursor-pointer focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
			>
				Create Note{" "}
				<span>
					<Plus />
				</span>
			</button>
		</div>
	);
}
