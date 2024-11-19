'use client'
import { useNote } from "@/context/NoteContext"
import { faCalendarWeek, faLayerGroup, faStar, IconDefinition } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"

export default function Nav(){
    const [width, setWidth] = useState<number>(500);

    useEffect(() => {
      if (typeof window !== 'undefined') {
        setWidth(window.innerWidth);
      }
    }, []);
  
    useEffect(() => {
      if (typeof window !== 'undefined') {
        const handleResize = () => {
          setWidth(window.innerWidth);
        };
  
        window.addEventListener('resize', handleResize);
          return () => {
          window.removeEventListener('resize', handleResize);
        };
      }
    }, []);

    const {setType, type} = useNote()

    interface option {
      category: string;
      icon: IconDefinition
    }


    const types: option[] = [ 
      {
        category: "All",
        icon: faLayerGroup
      },
      {
        category: "General",
        icon: faCalendarWeek
      },
      {
        category: "Important",
        icon: faLayerGroup
      },
      {
        category: "Starred",
        icon: faStar
      },
    ]
    
    return width > 768  ? (
        <div className="w-[20%] min-w-[215px] h-full bg-slate-800 p-3" >
        <h1
        className="font-bold text-3xl text-white font-mono border-b-2 pb-3"
        >
          QuickCapture
        </h1>
        
        <ul className="" >
          {
            types.map(({category, icon} : option) => (
                  <li className={` text-md font-semibold text-white border-b-[1px] p-1 flex items-center cursor-pointer transition-all gap-2 ${type == `${category}` ? " pl-5 text-blue-400" : ""}`} style={{color: type == `${category}` ? '#60a5fa' : ""}}   onClick={() => setType(category)}  >
                      <FontAwesomeIcon className="h-4" icon={icon} />
                      <h1>{category}</h1>
                  </li>
            ))
          }
        </ul>
         
     </div>
    ) : (
        <div className="flex p-2 " >
            {
              types.map(({category, icon}: option) => (
                <h1 className={`border-[1px] px-2 border-black rounded-xl text-md font-semibold py-1 mx-2  cursor-pointer ${type == `${category}` ? "bg-black text-white" : ""}`} onClick={() => setType(`${category}`)} >{category}</h1>
              ))
            }
           
        </div>
    )
}