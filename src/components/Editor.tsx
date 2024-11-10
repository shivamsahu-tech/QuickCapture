'use client'

import React, { useRef, useEffect } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css'; 
import './EditorStyle.css'
import { Note } from '@/types/Notes';

import { useRouter} from 'next/navigation';
import { useNote } from '@/context/NoteContext';

export default function Editor ({isIntercepting = false} : {
    isIntercepting: boolean,
    content: Note
})  {
    const editorRef = useRef<HTMLDivElement | null>(null);
    const quillRef = useRef<Quill | null>(null);
    const router = useRouter();
    const {Note, setNote} = useNote();
    const noteRef = useRef(Note);

    useEffect(() => {
        noteRef.current = Note;
    }, [Note]);
 
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
                    ...noteRef.current,
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
        <div className={`w-screen h-screen ${isIntercepting ? "" : 'background'}`} onClick={handleOpenChange}>
        <div className="w-full h-full flex bg-[#0000007d]">
            
            <div
                className="text-editor-container relative"
                style={{ backgroundColor: `${Note.color || "white"}` }}
                onClick={(e) => e.stopPropagation()} // Prevent click event propagation to parent
            >
    
                {/* Select Dropdown */}
                <select
                    name=""
                    id=""
                    value={Note.type}
                    onChange={(e) => { setNote({ ...Note, type: e.target.value }) }}
                    className="text-black absolute  top-[62px] right-0 font-semibold pr-[-10px] px-3 -p py-1 rounded-md appearance-none"
                >
                    <option value="All">All</option>
                    <option value="General">Gen</option>
                    <option value="Important">Imp</option>
                    <option value="Starred">Star</option>
                </select>
    
                {/* Title Input */}
                <input
                    type="text"
                    placeholder="title..."
                    value={Note.title}
                    onChange={(e) => { setNote({ ...Note, title: e.target.value }) }}
                    className="title-input w-full p-3 rounded-md focus:outline-none "
                    spellCheck={false}
                />
    
                {/* Editor */}
                <div
                    ref={editorRef}
                    style={{ width: '100%' }}
                    spellCheck={false}
                />
            </div>
        </div>
    </div>
    
    );
};

