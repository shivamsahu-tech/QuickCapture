'use client'
import "./globals.css";
import Dates from "./(dashboard)/@dates/page";
import Header from "./(dashboard)/@header/page";
import Nav from "./(dashboard)/@nav/page";
import Notes from "./(dashboard)/@notes/page";
import Create from "./(dashboard)/@createNew/page"
import {  useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useNote } from "@/context/NoteContext";
export default function Home() {
  const [width, setWidth] = useState(window.innerWidth)
  window.addEventListener('resize', () => {
      setWidth(window.innerWidth)
  })

  const {Note, Notes} = useNote();

  const saveNoteToServer = async() => {
      console.log("note save to the server : ", Note);
  }

  useEffect(() => {
    const noteExistsInNotes = Notes.some((n) => n.id === Note.id);

    if (!noteExistsInNotes || hasNoteChanged(Note, Notes)) {
      saveNoteToServer();
    }
  }, [Note, Notes]); 

  // A helper function to check if Note has changed (based on type, text, or title)
  const hasNoteChanged = (currentNote: typeof Note, allNotes: typeof Notes) => {
    const existingNote = allNotes.find((n) => n.id === currentNote.id);
    if (!existingNote) return true; // If note doesn't exist, it's considered changed

    // Compare fields that matter (you can expand this logic to check more fields)
    return (
      currentNote.type !== existingNote.type ||
      currentNote.text !== existingNote.text ||
      currentNote.title !== existingNote.title
    );
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
                  <Notes />
                </div>
              </div>
            </div>
    
           
        </>
      ) : (
        <div className="w-screen h-screen flex flex-col " >
                 <Header/>
                  <Dates/>
                  <Nav/>  
                  <Notes/>
        </div>
      )
    }
    <Create/>
    
    
  </div>
  )
  
  
  
  
  
  
  
}
