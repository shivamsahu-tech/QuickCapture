'use client'

import React, { useRef, useEffect, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css'; 
import './EditorStyle.css'
import { Note } from '@/types/Notes';

import { useRouter} from 'next/navigation';
import { useNote } from '@/context/NoteContext';

export default function Editor ({isIntercepting = false, content} : {
    isIntercepting: boolean,
    content: Note
})  {
    const editorRef = useRef<HTMLDivElement | null>(null);
    const quillRef = useRef<Quill | null>(null);
    const router = useRouter();


    const {Note, setNote} = useNote();

    

   
  
  
   
    useEffect(() => {
        if (editorRef.current) { 
            quillRef.current = new Quill(editorRef.current, {
                theme: 'snow', 
                modules: {
                    toolbar: [
                        ['bold', 'italic', 'underline', 'strike'], 
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        [{ 'align': [] }], 
                    ],
                },
            });

            quillRef.current.root.innerHTML = Note.text;

            quillRef.current.on('text-change', () => {
                setNote({
                    ...Note,
                    text: quillRef.current?.root.innerHTML || ""
                });
            });
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("cameFromEditor", "true");
      }, []);

    
    const handleOpenChange = () => {
        router.back()
    }

    return (
       <div className={`w-screen h-screen  ${isIntercepting ? "" : 'background'} `} onClick={handleOpenChange} >
            <div className='w-full h-full flex bg-[#0000007d]' >
                <div className='text-editor-container' style={{backgroundColor: `${Note.color || "white"}`}} onClick={(e) => e.stopPropagation()}  >
                    <div className='flex relative flex-col  ' >
                        <input type="text" placeholder='title...' value={Note.title} onChange={(e) => {setNote({...Note, title:e.target.value})}} className='title-input w-full  border-2 border-black  sdfsd bg-red-700 ' spellCheck={false}  />
                        <select name="" id="" value={Note.type} onChange={(e) => {setNote({...Note, type:e.target.value})}} className='border-2 border-black absolute right-0'>
                            <option value="type">Type</option>
                            <option value="star">Starred</option>
                            <option value="imp">Important</option>
                            <option value="gen">General</option>
                        </select>
                    </div>
                    <div ref={editorRef} style={{width: '100%' }} spellCheck={false} />
                </div>
            </div>
       </div>
    );
};

