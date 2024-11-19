'use client'
import {Note} from "@/types/Notes"
import DOMPurify from "dompurify"
import "./noteCards-style.css"
import { useNote } from "@/context/NoteContext";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { useToast } from "@/hooks/use-toast";


export default function 
NoteCards({content} : {content: Note}){


    const sanitizedHtmlString: string = DOMPurify.sanitize(content.text);
    const {setNote, setNotes, Notes, isGuest} = useNote();
    const {toast} = useToast();
    const router = useRouter();

    const route = () => {
        setNote(content)
        router.push(`/editor/${content.id}`)

    }

    const handleTrashClick = (event: any) => {
      
      event.stopPropagation();  
      deleteNote();
    };



    const deleteNote = async() => {
      if(isGuest){
        router.push(`/sign-up`);
        toast({
          variant: 'destructive',
          title: "Authorize Yourself!!",
          description: "sign in before delete notes"
        })
        return;
      }
        try {
          const response = await fetch(`/api/delete-note`, {
            method: 'POST',
            body: JSON.stringify({id: content.id})
          })
          if(!response.ok){
            toast({
              variant: 'destructive',
              title: "Error",
              description: "Untraced Error!!"
            })
            return;
          }
          setNotes(Notes.filter((note) => note.id !== content.id));
        } catch (error) {
          console.error("delete error : ", error)
        }  
      };
    
    
    return (

                <div className={`w-full h-fit p-4 rounded-xl my-2 cursor-pointer`} style={{backgroundColor: content.color}} onClick={route} >
                    <div className="flex justify-between" >
                        <h1
                        className="text-md mb-2 font-semibold capitalize "
                        >{content?.title || ""}</h1>
                        <FontAwesomeIcon className="cursor-pointer w-3 text-slate-800" onClick={(e) => handleTrashClick(e)} icon={faTrashCan} />
                    </div>
                    <div
                        className="text-[13px]"
                        dangerouslySetInnerHTML={{ __html: sanitizedHtmlString }} 
                    />
                </div>


    )
}