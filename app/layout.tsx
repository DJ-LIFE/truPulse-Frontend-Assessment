"use client";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import ConnectionStatus from "@/components/ConnectionStatus";
import { syncNotes } from "@/lib/syncService";
import { useEffect } from "react";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});
const fontPoppins = Poppins({
	variable: "--font-poppins",
	subsets: ["latin"],
	weight: ["400", "600", "200", "800"], // or include other weights as needed
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const isOnline = useOnlineStatus();

	// Attempt to sync when online status changes
	useEffect(() => {
		if (isOnline) {
			syncNotes();
		}
	}, [isOnline]);

	return (
		<html lang="en">
			<body
				className={`${fontPoppins.variable} ${geistSans.variable} ${geistMono.variable} antialiased bg-neutral-100`}
			>
				<header className="bg-pink-500 text-white p-4">
					<div className="container mx-auto flex justify-between items-center">
						<h1 className="text-xl font-bold">Notes App</h1>
						<ConnectionStatus />
					</div>
				</header>
				<div className="container mx-auto">{children}</div>
			</body>
		</html>
	);
}
