'use client'
import "./globals.css";
import Dates from "./(dashboard)/@dates/page";
import Header from "./(dashboard)/@header/page";
import Nav from "./(dashboard)/@nav/page";
import NotesPage from "./(dashboard)/@notes/page";
import Create from "./(dashboard)/@createNew/page"
import {  useEffect, useState } from "react";
import { useNote } from "@/context/NoteContext";
import { usePathname } from "next/navigation";
import { useToast } from "@/hooks/use-toast";



export default function Home() {
  const [width, setWidth] = useState<number>(500);

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
