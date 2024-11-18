'use client'
import "./globals.css";
import { useNote } from "@/context/NoteContext";
import { usePathname } from "next/navigation";
import { useEffect, useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import dynamic from 'next/dynamic';
import { useRouter } from "next/navigation";

// Dynamically importing components to run only on the client-side (SSR is disabled)
const Nav = dynamic(() => import("./dashboard/@nav/page"), { ssr: false });
const Header = dynamic(() => import("./dashboard/@header/page"), { ssr: false });
const Dates = dynamic(() => import("./dashboard/@dates/page"), { ssr: false });
const NotesPage = dynamic(() => import("./dashboard/@notes/page"), { ssr: false });
const Create = dynamic(() => import("./dashboard/@createNew/page"), { ssr: false });


export default function Home() {
  const [width, setWidth] = useState<number>(500);
  const {isGuest} = useNote();
  const router = useRouter();

    useEffect(() => {
      if (typeof window !== 'undefined') {
        setWidth(window.innerWidth);
      }
    }, []);
  
    useEffect(() => {
      if (typeof window !== 'undefined') {
        const handleResize = () => {
          setWidth(window.innerWidth);
        };
  
        window.addEventListener('resize', handleResize);
          return () => {
          window.removeEventListener('resize', handleResize);
        };
      }
    }, []);


 

  const {Note, Notes, setNotes} = useNote();
  const pathname = usePathname(); // Use `usePathname` to track the route
  const {toast} = useToast();

  const saveNoteToServer = async () => {
    if(isGuest){
      toast({
        variant: 'destructive',
        title: "Authorize Yourself!!",
        description: "sign in before save notes"
      })
      return;
    }
    console.log('Saving note to the server: ', Note);
    try{
      const response = await fetch("/api/save-note", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Make sure the content type is set
        },
        body: JSON.stringify(Note), // Serialize the Note object
      });
    
      console.log(response);
      if(!response.ok){
        toast({
          variant: 'destructive',
          title: "Error",
          description: "Untraced Error!!",
        });
      }
    } catch (error) {
      console.error("Error : ", error)
      toast({
        variant: 'destructive',
        title: "Error",
        description: "Untraced Error!!",
      });
    }

  };

  useEffect(() => {
    const cameFromEditor = localStorage.getItem('cameFromEditor');
    if (cameFromEditor === 'true' && pathname === '/') {
      if(hasNoteChanged(Note, Notes)){
        saveNoteToServer();
      }
        
      localStorage.removeItem('cameFromEditor');
    }
  }, [pathname, Note, Notes]); 


  const hasNoteChanged = (
    currentNote: typeof Note,
    allNotes: typeof Notes,
  ) => {
    if(currentNote.title == "" ) return false;
    const existingNote = allNotes.find((n: { id: any; }) => n.id === currentNote.id);
  
    if (!existingNote) {
      if(currentNote.title)
      setNotes([...allNotes, currentNote]);
      return true;
    }
  
    const hasChanged = (
      currentNote.type != existingNote.type ||
      currentNote.text != existingNote.text ||
      currentNote.title != existingNote.title
    );
  
    if (hasChanged) {
      setNotes(
        allNotes.map((note) =>
          note.id === currentNote.id ? currentNote : note
        )
      );
    }
  
    return hasChanged;
  };
  
  

  
  return (

  <div  className="w-screen h-screen relative" >
    {
      width > 768  ?
      (
        <>
            <div className="relative w-[100vw] h-[100vh]">
              <div className="flex w-full h-full">
              <Nav />
                <div className="w-[70%] flex flex-col flex-1">
                  <Header />
                  <Dates />
                  <NotesPage />
                </div>
              </div>
            </div>
    
           
        </>
      ) : (
        <div className="w-screen h-screen flex flex-col " >
                 <Header/>
                  <Dates/>
                  <Nav/>  
                  <NotesPage/>
        </div>
      )
    }
    <Create/>
  </div>
  )
  
  
  
  
  
  
  
}
