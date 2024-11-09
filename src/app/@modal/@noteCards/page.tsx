'use client'
import {Note} from "@/types/Notes"
import Link from "next/link";
import DOMPurify from "dompurify"
import "./noteCards-style.css"
import { useNote } from "@/context/NoteContext";
import { useRouter } from "next/navigation";


export default function NoteCards({content} : {content: Note}){



    

    const sanitizedHtmlString: string = DOMPurify.sanitize(content.text);
    const {setNote} = useNote();

    const router = useRouter();

    const route = () => {
        setNote(content)
        router.push(`/editor/${content.id}`)

    }

    
    return (

                <div className={`w-full h-fit p-4 rounded-xl my-2 cursor-pointer`} style={{backgroundColor: content.color}} onClick={route} >
                    <h1
                    className="text-md mb-2 font-semibold capitalize "
                    >{content?.title || ""}</h1>
                    <div
                        className="text-[13px]"
                        dangerouslySetInnerHTML={{ __html: sanitizedHtmlString }} 
                    />
                </div>


    )
}