import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NoteContextProvider } from "@/context/NoteContext";
import { Toaster } from "@/components/ui/toaster";
import FileUpload from "@/components/FileUpload";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Quick Capture",
  description: "Capture your moments",
};

export default function RootLayout({
  children,
  modal
}: Readonly<{
  children: React.ReactNode
  modal: React.ReactNode
}>) {


  return (
    <html lang="en">
      <head>
        <link rel="icon" href="https://res.cloudinary.com/dfl8h4on4/image/upload/v1731628369/OIP-removebg-preview_caszsy.png" type="image/png" />
      </head>
      <body className={inter.className}>
        <NoteContextProvider> 
          {modal}
          {children}
          <FileUpload/>
        </NoteContextProvider>
        <Toaster/>
        
        {/* <h1>sdfsdf</h1> */}
      </body>
    </html>
  );
}
