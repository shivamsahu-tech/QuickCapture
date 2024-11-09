'use client'
import { faCalendarWeek, faLayerGroup, faStar } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState } from "react"

export default function Nav(){

    const [width, setWidth] = useState(window.innerWidth)
    window.addEventListener('resize', () => {
        setWidth(window.innerWidth)
    })
    
    return width > 768  ? (
        <div className="w-[20%] min-w-[215px] h-full bg-slate-800 p-3" >
        <h1
        className="font-bold text-3xl text-white font-mono border-b-2 pb-3"
        >
          QuickCapture
        </h1>
        
        <ul className="" >
          <li className=" text-md font-semibold text-white border-b-[1px] p-1 flex items-center gap-2" >
              <FontAwesomeIcon className="h-4" icon={faLayerGroup} />
              <h1>All</h1>
          </li>

          <li className=" text-md font-semibold text-white border-b-[1px] p-1 flex items-center gap-2" >
              <FontAwesomeIcon className="h-4" icon={faCalendarWeek} />
              <h1>Today</h1>
          </li>

          <li className=" text-md font-semibold text-white border-b-[1px] p-1 flex items-center gap-2" >
              <FontAwesomeIcon className="h-4" icon={faStar} />
              <h1>Starred</h1>
          </li>

          <li className=" text-md font-semibold text-white border-b-[1px] p-1 flex items-center gap-2" >
              <FontAwesomeIcon className="h-4" icon={faLayerGroup} />
              <h1>Urgent</h1>
          </li>

        </ul>
         
     </div>
    ) : (
        <div className="flex p-2 " >
            <h1 className="border-[1px] px-2 border-black rounded-xl text-md font-semibold py-1 mx-2" >All</h1>
            <h1 className="border-[1px] px-2 border-black rounded-xl text-md font-semibold py-1 mx-2" >Today</h1>
            <h1 className="border-[1px] px-2 border-black rounded-xl text-md font-semibold py-1 mx-2" >Starred</h1>
            <h1 className="border-[1px] px-2 border-black rounded-xl text-md font-semibold py-1 mx-2" >Urgent</h1>
           
        </div>
    )
}