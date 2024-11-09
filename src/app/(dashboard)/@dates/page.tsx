import React from "react";

export default function Dates() {
    const dates = generateDates();
    return (
       <div className=" w-full flex justify-center py-2 gap-3 overflow-hidden" >
        {
            dates.map((obj) => (
                <DateBox day={obj.day} date={obj.date} month={obj.month} isToday={obj.isToday} />
            ))
        }  
       </div>
    ); 
}

type DateProps = {
    day: string;
    date: string;
    month: string;
    isToday: boolean;
}

const DateBox = ({ day, date, month, isToday }: DateProps) => {
    return (
        <div className={` rounded-2xl py-1 px-1 w-[55px]  border-2 flex flex-col items-center 
          ${isToday ? "bg-black text-white border-black" : "bg-white text-[#18181f]"}
        `} >
            <p
            className="font-semibold text-sm md:text-sm "
            >{day}</p>
            <p
            className="font-bold text-4xl md:text-4xl"
            >{date}</p>
            <p
            className="font-semibold text-sm md:text-sm "
            >{month}</p>
        </div>
    );
};



const generateDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = -10; i <= 10; i++) {
      const newDate = new Date();
      newDate.setDate(today.getDate() + i);
      dates.push({
        day: newDate.toLocaleString("en-us", { weekday: 'short' }), 
        date: newDate.getDate() < 10 ? '0'+newDate.getDate().toString() : newDate.getDate().toString() ,
        month: newDate.toLocaleString("en-us", { month: 'short' }), 
        isToday: i == 0 ? true : false
      });
    }
    return dates;
  };
