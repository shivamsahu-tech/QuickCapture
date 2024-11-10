'use client'
import React from 'react'
import Editor from '@/components/Editor'
import { useNote } from '@/context/NoteContext'

export default function Page() {

 const {Note} = useNote()


  return <Editor isIntercepting={false} content={Note}  />
}


