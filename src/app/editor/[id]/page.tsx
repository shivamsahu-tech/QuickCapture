'use client'
import React, { useEffect } from 'react'
import Editor from '@/components/Editor'
import { useNote } from '@/context/NoteContext'

function page() {

 const {Note} = useNote()


  return <Editor isIntercepting={false} content={Note}  />
}

export default page
