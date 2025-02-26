'use client'
// NoteContext.ts
import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { Note } from "@/types/Notes";
import { GuestNotes } from "@/GuestNote";
import { useRouter } from "next/navigation";

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
  isGuest: boolean;
  setIsGuest: (type:boolean) => void;
  imageURL: string;
  setImageURL: (type: string) => void;
  isImageUploaderVisible: boolean;
  setImageUploaderVisible: (type: boolean) => void;
}

const NoteContext = createContext<NoteContextType | undefined>(undefined);

export const NoteContextProvider = ({ children }: { children: ReactNode }) => {
  const [Note, setNote] = useState<Note>(defaultNote);
  const [Notes, setNotes] = useState<Array<Note>>([]);
  const [type, setType] = useState<string>("All");
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const [imageURL , setImageURL] = useState<string>("https://api.dicebear.com/9.x/avataaars/svg?seed=Katherine");
  const [isImageUploaderVisible, setImageUploaderVisible] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setNote(() => {
        const savedNote = localStorage.getItem("note");
        return savedNote ? JSON.parse(savedNote) : defaultNote;
      });
    }
  }, []);
  

  const fetchNotes = async (): Promise<Array<Note>> => {
    try {
      const response = await fetch('/api/get-notes'); 
      const data = await response.json();
      return data.data; 
    } catch (error) {
      console.error("Error in fetching notes:", error);
      return []; 
    }
  };

  useEffect(() => {
    const loadNotes = async () => {
      const fetchedNotes = await fetchNotes(); 
      if(isGuest) setNotes(GuestNotes);
      else setNotes(fetchedNotes);
    };

    loadNotes(); 
  }, [router, Note, isGuest]); 

  const fetchProfileUrl = async (): Promise<string> => {
    try {
      const response = await fetch('/api/get-profileimageurl'); 
      const data = await response.json();
      console.log("fetched user profile image data: ", data.data[0].profileimageurl)
      return data.data[0].profileimageurl; 
    } catch (error) {
      console.error("Error in fetching image url:", error);
      return "https://api.dicebear.com/9.x/avataaars/svg?seed=Katherine"; 
    }
  };

  useEffect(() => {
    const profileImage = async () => {
      const fetchedUrl = await fetchProfileUrl(); 
      setImageURL(fetchedUrl)
    };

    profileImage(); 
  }, []); 



  useEffect(() => {

    function getCookie(name: string): string | null {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift() ?? null;
      return null;
    }

    if (Note || typeof window !== 'undefined') {
      const isGuestCookie = getCookie("isGuest");
      if(!isGuest && (isGuestCookie && isGuestCookie == 'true')){
        document.cookie = "isGuest=false";
        router.push('/sign-up');
      }
    }
  }, [isGuest, router]);

  useEffect(() => {
    if (Note || typeof window !== 'undefined') {
      localStorage.setItem("note", JSON.stringify(Note));  
    }
  }, [Note]);

  return (
    <NoteContext.Provider value={{ Note, setNote, Notes, setNotes , type, setType, isGuest, setIsGuest, imageURL, setImageUploaderVisible, setImageURL, isImageUploaderVisible}}>
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
