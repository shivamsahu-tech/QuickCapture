'use client'
import { useNote } from "@/context/NoteContext"
import { faCalendarWeek, faLayerGroup, faStar } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState } from "react"

export default function Nav(){

    const [width, setWidth] = useState(window.innerWidth)
    window.addEventListener('resize', () => {
        setWidth(window.innerWidth)
    })

    const {setType, type} = useNote()
    
    return width > 768  ? (
        <div className="w-[20%] min-w-[215px] h-full bg-slate-800 p-3" >
        <h1
        className="font-bold text-3xl text-white font-mono border-b-2 pb-3"
        >
          QuickCapture
        </h1>
        
        <ul className="" >
          <li className={` text-md font-semibold text-white border-b-[1px] p-1 flex items-center cursor-pointer transition-all gap-2 ${type == "All" ? " pl-5 text-blue-400" : ""}`}  onClick={() => setType("All")}  >
              <FontAwesomeIcon className="h-4" icon={faLayerGroup} />
              <h1>All</h1>
          </li>

          <li className={` text-md font-semibold text-white border-b-[1px] p-1 flex items-center cursor-pointer transition-all gap-2 ${type == "General" ? " pl-5 text-blue-400" : ""}`}  onClick={() => setType("General")} >
              <FontAwesomeIcon className="h-4" icon={faCalendarWeek} />
              <h1>General</h1>
          </li>

          <li className={` text-md font-semibold text-white border-b-[1px] p-1 flex items-center cursor-pointer transition-all gap-2 ${type == "Important" ? " pl-5 text-blue-400" : ""}`}  onClick={() => setType("Important")}  >
              <FontAwesomeIcon className="h-4" icon={faStar} />
              <h1>Important</h1>
          </li>

          <li className={` text-md font-semibold text-white border-b-[1px] p-1 flex items-center cursor-pointer transition-all gap-2 ${type == "Starred" ? " pl-5 text-blue-400" : ""}`}  onClick={() => setType("Starred")} >
              <FontAwesomeIcon className="h-4" icon={faLayerGroup} />
              <h1>Starred</h1>
          </li>

        </ul>
         
     </div>
    ) : (
        <div className="flex p-2 " >
            <h1 className={`border-[1px] px-2 border-black rounded-xl text-md font-semibold py-1 mx-2  cursor-pointer ${type == "All" ? "bg-black text-white" : ""}`} onClick={() => setType("All")} >All</h1>
            <h1 className={`border-[1px] px-2 border-black rounded-xl text-md font-semibold py-1 mx-2  cursor-pointer ${type == "General" ? "bg-black text-white" : ""}`} onClick={() => setType("General")} >General</h1>
            <h1 className={`border-[1px] px-2 border-black rounded-xl text-md font-semibold py-1 mx-2  cursor-pointer ${type == "Important" ? "bg-black text-white" : ""}`} onClick={() => setType("Important")} >Important</h1>
            <h1 className={`border-[1px] px-2 border-black rounded-xl text-md font-semibold py-1 mx-2  cursor-pointer ${type == "Starred" ? "bg-black text-white" : ""}`} onClick={() => setType("Starred")} >Starred</h1>
          
        </div>
    )
}