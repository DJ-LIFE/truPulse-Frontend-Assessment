"use client";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { useEffect, useState } from "react";

const ConnectionStatus = () => {
	const isOnline = useOnlineStatus();
	const [syncStatus, setSyncStatus] = useState<string>("Checking...");

	useEffect(() => {
		if (isOnline) {
			setSyncStatus("Connected");
		} else {
			setSyncStatus("Disconnected");
		}
	}, [isOnline]);

	return (
		<div
			className={`text-sm px-3 py-1 rounded-full ${
				isOnline
					? "bg-green-100 text-green-800 border border-green-500"
					: "bg-red-100 text-red-800 border border-red-500"
			}`}
		>
			{syncStatus}
		</div>
	);
};

export default ConnectionStatus;
