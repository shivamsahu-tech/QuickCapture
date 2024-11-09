'use client'
// NoteContext.ts
import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { Note } from "@/types/Notes";
import { arrayOfObjects } from "@/notes";

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
}

const NoteContext = createContext<NoteContextType | undefined>(undefined);

export const NoteContextProvider = ({ children }: { children: ReactNode }) => {
  const [Note, setNote] = useState<Note>(() => {
    const savedNote = localStorage.getItem("note");
    return savedNote ? JSON.parse(savedNote) : defaultNote;  // Initialize from localStorage if available
  });
  const [Notes, setNotes] = useState<Array<Note>>(arrayOfObjects);

  useEffect(() => {
    if (Note) {
      localStorage.setItem("note", JSON.stringify(Note));  // Save the current note to localStorage
    }
  }, [Note]);


  useEffect(() => {
    if (Note) {
      localStorage.setItem("note", JSON.stringify(Note)); 
    }
  }, [Note]);

  return (
    <NoteContext.Provider value={{ Note, setNote, Notes, setNotes }}>
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
