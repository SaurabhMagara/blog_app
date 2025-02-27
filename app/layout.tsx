import type { Metadata } from "next";
import "./globals.css";
import { UserContextProvider } from "@/context/userContext";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Blog App",
  description: "A Blog app project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className={`antialiased overflow-x-hidden`}>
        <Toaster position="top-right"/>
        <UserContextProvider>{children}</UserContextProvider>
      </body>
    </html>
  );
}
