'use client'
// NoteContext.ts
import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { Note } from "@/types/Notes";

// Define the default note value
const defaultNote: Note = {
  id: "1221",
  title: "Note",
  type: "Note",
  text: "Note",
  color: "white"
};



// Define the shape of our context
interface NoteContextType {
  Note: Note;
  setNote: (note: Note) => void;
  Notes: Array<Note>
  setNotes: (notes: Array<Note>) => void;
  type: string;
  setType: (type:string) => void;
}

const NoteContext = createContext<NoteContextType | undefined>(undefined);

export const NoteContextProvider = ({ children }: { children: ReactNode }) => {
  const [Note, setNote] = useState<Note>(() => {
    const savedNote = localStorage.getItem("note");
    return savedNote ? JSON.parse(savedNote) : defaultNote;  // Initialize from localStorage if available
  });
  const [Notes, setNotes] = useState<Array<Note>>([]);
  const [type, setType] = useState<string>("All")

  const fetchNotes = async (): Promise<Array<Note>> => {
    try {
      const response = await fetch('/api/get-notes'); 
      const data = await response.json();
      console.log(data.data)
      return data.data; 
    } catch (error) {
      console.error("Error in fetching notes:", error);
      return []; 
    }
  };

  useEffect(() => {
    const loadNotes = async () => {
      const fetchedNotes = await fetchNotes(); 
      setNotes(fetchedNotes);
      console.log("set note : ",  fetchedNotes)
    };

    loadNotes(); 
  }, []); 

  useEffect(() => {
    if (Note) {
      localStorage.setItem("note", JSON.stringify(Note));  // Save the current note to localStorage
    }
  }, [Note]);

  return (
    <NoteContext.Provider value={{ Note, setNote, Notes, setNotes , type, setType}}>
      {children}
    </NoteContext.Provider>
  );
};

// Custom hook to use Note context
export const useNote = () => {
  const context = useContext(NoteContext);
  if (!context) {
    throw new Error("useNote must be used within a NoteContextProvider");
  }
  return context;
};
