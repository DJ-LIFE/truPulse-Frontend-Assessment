"use client";
import { useState, useEffect } from "react";

export const useOnlineStatus = () => {
	const [isOnline, setIsOnline] = useState(
		typeof navigator !== "undefined" ? navigator.onLine : true
	);

	useEffect(() => {
		const handleOnline = () => {
			setIsOnline(true);
		};
		const handleOffline = () => {
			setIsOnline(false);
		};

		// Add standard event listeners
		window.addEventListener("online", handleOnline);
		window.addEventListener("offline", handleOffline);

		// Set up a more reliable check using fetch
		const checkOnlineStatus = async () => {
			try {
				// Try to fetch a tiny resource from your own domain
				// This will fail when truly offline
				const response = await fetch("/favicon.ico", {
					method: "HEAD",
					// Cache control to prevent getting cached responses
					cache: "no-store",
					// Set a short timeout
					signal: AbortSignal.timeout(2000),
				});

				setIsOnline(response.ok);
			} catch (error) {
				// If fetch fails, we're offline
				setIsOnline(false);
			}
		};

		// Run the check immediately
		checkOnlineStatus();

		// Set up interval to check periodically
		const intervalId = setInterval(checkOnlineStatus, 30000); // Check every 30 seconds

		return () => {
			window.removeEventListener("online", handleOnline);
			window.removeEventListener("offline", handleOffline);
			clearInterval(intervalId);
		};
	}, []);

	return isOnline;
};
