'use client'; // Ensures this code is executed on the client-side

import { useNote } from '@/context/NoteContext';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { nanoid } from 'nanoid';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

function Create() {
  const [isClient, setIsClient] = useState(false);

  // This ensures that the code will only run once the component is mounted on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null; // Prevent rendering this component until client-side

  const matteColors = [
    '#B0C8E6', '#DBA9C3', '#D3C171', '#8DBDA2', '#D9B8A9', '#A09FC5',
    '#D09685', '#8CB297', '#D4B172', '#A9ABB4', '#C9A37D', '#94BADE',
    '#BAC98E', '#D19BA3', '#A2A6BA', '#98C0AA',
  ];

  function getRandomMatteColor(): string {
    const randomIndex = Math.floor(Math.random() * matteColors.length);
    return matteColors[randomIndex];
  }

  const id = nanoid();
  const router = useRouter();
  const { setNote } = useNote();

  const createNote = () => {
    setNote({
      id,
      title: '',
      type: '',
      text: '',
      color: getRandomMatteColor(),
    });
    router.push(`/editor/${id}`);
  };

  return (
    <div
      className="absolute z-10 w-[8vh] h-[8vh] flex justify-center items-center cursor-pointer bg-black bottom-20 right-20 max-sm:right-10 p-2 rounded-[50%]"
      onClick={createNote}
    >
      <FontAwesomeIcon className="text-white text-3xl" icon={faPlus} />
    </div>
  );
}

export default Create;
