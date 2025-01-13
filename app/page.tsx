"use client"

import Navbar from "@/components/Navbar";
import LoginPage from "./auth/login/page";

export default function Home() {
  return (
    <div className="flex flex-col items-center h-screen min-w-full">
      <div className="w-full flex justify-center items-center sticky top-0 z-10">
        <Navbar />
      </div>
    </div>
  );
}
