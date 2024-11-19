'use client'
import { Spinner } from '@/components/ui/Spinner';
import { useNote } from '@/context/NoteContext';
import { useToast } from '@/hooks/use-toast';
import { Note } from '@/types/Notes';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

export default function Page()  {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const {toast} = useToast();
  const {setNotes, setIsGuest} = useNote();
  const [guestLoading, setGuestLoading] = useState(false);


  const fetchNotes = async (): Promise<Array<Note>> => {
    try {
      const response = await fetch('/api/get-notes'); 
      const data = await response.json();
      return data.data; 
    } catch (error) {
      console.error("Error in fetching notes:", error);
      return []; 
    }
  };

  const submit = async() => {
    if(!(email || password)){
      toast({
        variant: "destructive",
        title: "Invalid Input",
        description: "Please try again",
    });
    return;
    }
    setIsLoading(true);
    try {
      const result = await fetch("/api/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });
      const data = await result.json();
      if(result.ok){
        if(data.user.isverified){
          const fetchedNotes = await fetchNotes();
          setNotes(fetchedNotes);
          router.push("/");
        }
        else{
          toast({
            title: "OTP sent successfully",
            description: "verify you account",
            className: "bg-green-600"
          });
          router.push("/otp-verification");
        }
      }else{
        toast({
          variant: 'destructive',
          title: data.message,
          description: "Please Try again",
        });
      }
      
    } catch (error) {
        console.error("sign up submit error : ", error);
        toast({
          variant: 'destructive',
          title: "Something went wrong!",
          description: "please Try Again",
        });
    }
    setEmail("");
    setPassword("");
    setIsLoading(false);
}

  const signGuest = async() => {
    setGuestLoading(true);
    try {
      const result = await fetch("/api/sign-in-guest");
      if(result.ok){
        router.push("/");
        setIsGuest(true)
        toast({
          title: "Signed in as Guest!!",
          description: "Guest for next 15min",
          className: "bg-green-600"
        });
        
      }else{
        toast({
          variant: 'destructive',
          title: "Something went wrong",
          description: "Please Try again",
        });
      }
      
    } catch (error) {
        console.error("sign up submit error : ", error);
        toast({
          variant: 'destructive',
          title: "Something went wrong!",
          description: "please Try Again",
        });
    }
    setGuestLoading(false);
  }




return (
<div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 ">
  <div className='border-2 border-slate-300 m-auto p-6 rounded-md' >
    <div className="sm:mx-auto sm:w-full sm:max-w-sm ">
        <img className="mx-auto h-16 w-auto" src="https://th.bing.com/th/id/OIP.wlVtctNEeskBNhpk2H2UFQHaHa?pid=ImgDet&w=474&h=474&rs=1" alt="QuickCapture"/>
        <h1 className='text-center'>Quick Capture</h1>
        <h2 className="mt-6 text-center text-2xl/9 font-bold tracking-tight text-gray-900 px-16">Sign in to your account</h2>
    </div>

    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="space-y-6">
        <div>
            <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">Email address</label>
            <div className="mt-2">
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}   required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6 px-3" />
            </div>
        </div>

        <div>
            <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">Password</label>
            <div className="text-sm">
                <a href="/forget-password" className="font-semibold text-indigo-600 hover:text-indigo-500">Forgot password?</a>
            </div>
            </div>
            <div className="mt-2">
            <input id="password"  type="password" value={password} onChange={(e) => setPassword(e.target.value)}  required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6 px-3" />
            </div>
        </div>

        <div>
            
            <button className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={submit}
            >{isLoading ? <Spinner/> : "Sign in"} </button>
        </div>
        </div>

        <button className="flex mx-auto mt-5 justify-center rounded-md bg-white  px-3 py-1.5 text-sm/6 font-semibold text-black shadow-sm hover:bg-slate-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-300"
        onClick={signGuest}
        >{ !guestLoading ? "Sign up As Guest" : <Spinner />  }</button>

        <p className="mt-5 text-center text-sm/6 text-gray-500">
        Haven't Account
        <a href="/sign-up" className="font-semibold text-indigo-600 hover:text-indigo-500">Sign up</a>
        </p>
    </div>
  </div>
</div>
  )
}

