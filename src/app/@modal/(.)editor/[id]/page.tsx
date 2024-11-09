'use client'
import { Modal } from '@/components/Modal'
import React, { useContext } from 'react'
import Editor from "@/components/Editor"
import { useSearchParams } from 'next/navigation'
import { useNote } from '@/context/NoteContext'

function page() {

  const {Note}  = useNote();

  return (
    <Modal>
      <Editor isIntercepting={true} content={Note} />
    </Modal>
  )
}

export default page
