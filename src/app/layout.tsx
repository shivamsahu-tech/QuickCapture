import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NoteContextProvider } from "@/context/NoteContext";
import { Toaster } from "@/components/ui/toaster";
import FileUpload from "@/components/FileUpload";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Quick Capture – Capture, Edit & Save Effortlessly",
  description: "Quick Capture allows you to take notes, edit, and store them effortlessly. Now with profile image uploads & seamless UI!",
  keywords: "Quick Capture, online notes, cloud notes, Markdown notes, Cloudinary upload, Next.js notes app",
  openGraph: {
    title: "Quick Capture – Capture, Edit & Save Effortlessly",
    description: "Now with profile photo uploads, optimized UI, and smooth note management!",
    url: "https://yourwebsite.com",
    siteName: "Quick Capture",
    images: [
      {
        url: "https://th.bing.com/th/id/OIP.wlVtctNEeskBNhpk2H2UFQHaHa?pid=ImgDet&w=474&h=474&rs=1", // Replace with your OG image
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
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
