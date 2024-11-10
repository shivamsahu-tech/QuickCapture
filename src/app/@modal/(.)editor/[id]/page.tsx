'use client'
import { Modal } from '@/components/Modal'
import React from 'react'
import Editor from "@/components/Editor"
import { useNote } from '@/context/NoteContext'

export default function Page()  {

  const {Note}  = useNote();

  return (
    <Modal>
      <Editor isIntercepting={true} content={Note} />
    </Modal>
  )
}


