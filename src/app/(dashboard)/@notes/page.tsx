'use client'
import { useState } from "react";
import NoteCards from "@/app/@modal/@noteCards/page"
import { useNote } from "@/context/NoteContext";
import {Note} from "@/types/Notes"
import { nanoid } from "nanoid";

export default function NotesPage(){
    const [width, setWidth] = useState(window.innerWidth)
    const {Notes, type} = useNote();
    window.addEventListener('resize', () => {
        if(width > 1220) setCols(4);
        else if(width > 720) setCols(3);
        else setCols(2);
        setWidth(window.innerWidth)
    })

    const [cols, setCols] = useState(width > 1220 ? 4 : width > 720 ? 3 : 2);
    const colBoxes = [];
    const arr = type == "All" ?  Notes : Notes?.filter(note => note.type == type)
    console.log(arr)
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
                notesArray?.map((obj) => (
                    <NoteCards key={nanoid()} content={obj} />
                ))
            }
        </div>
    )
}