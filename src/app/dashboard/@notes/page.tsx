'use client'
import { useEffect, useState } from "react";
import NoteCards from "@/app/@modal/@noteCards/page"
import { useNote } from "@/context/NoteContext";
import {Note} from "@/types/Notes"
import { nanoid } from "nanoid";

export default function NotesPage(){
    const [width, setWidth] = useState<number>(500);

    useEffect(() => {
      if (typeof window !== 'undefined') {
        setWidth(window.innerWidth);
      }
    }, []);
  
    useEffect(() => {
      if (typeof window !== 'undefined') {
        const handleResize = () => {
            setWidth(window.innerWidth)
        };
  
        window.addEventListener('resize', handleResize);
          return () => {
          window.removeEventListener('resize', handleResize);
        };
      }
    }, []);

    useEffect(() => {
        if(width > 1220) setCols(4);
        else if(width > 720) setCols(3);
        else setCols(2);
    }, [width])

    const {Notes, type} = useNote();


    const [cols, setCols] = useState(width > 1220 ? 4 : width > 720 ? 3 : 2);
    const colBoxes = [];
    const arr = type == "All" ?  Notes : Notes?.filter(note => note.type == type)
    for(let i = 0; i < cols; i++) {
        const array = arr?.filter((_, idx) => {
            return idx % cols === i; 
        });
        colBoxes.push(<Boxes key={i} notesArray={array} />);
    }

    return (
        <div 
        className={`grid overflow-scroll flex-1 p-4 ${cols === 4 ? 'grid-cols-4' : ''} ${cols === 3 ? 'grid-cols-3' : ''} ${cols === 2 ? 'grid-cols-2' : ''} gap-4`}
        >
         { colBoxes } 
        </div>
    )
}


const Boxes = ({notesArray} : {notesArray: Note[]}) => {                      
    return (
        <div>
            {
                notesArray?.map((obj: Note) => (
                    <NoteCards key={obj.id} content={obj as Note} />
                ))
            }
        </div>
    )
}