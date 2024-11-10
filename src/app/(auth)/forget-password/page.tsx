"use client"
import { Spinner } from '@/components/ui/Spinner';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

export default function Page()  {

  const [email, setEmail] = useState("");
  const {toast} = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const sentOtp = async() => {
    setIsLoading(true);
    try {
      console.log("entered to sent otp funciton");
      const response = await fetch("/api/send-otp", {
          method: "POST",
          body: JSON.stringify({ email })
      });
      console.log("forget password response: ", response)
      if (response.ok) {
          toast({
              title: "Successful!!",
              description: "OTP sent successfully!!",
              className: "bg-green-600",
          });
          console.log("otp sent successfylly")
          router.push("/change-password");
      } else {
          toast({
              variant: "destructive",
              title: "Something went wrong!!",
              description: "Please try again",
          });
      }
  } catch (error) {
    console.error("Error : ", error)
      toast({
          variant: "destructive",
          title: "Something went wrong!!",
          description: "Please try again",
      });
  }
  setIsLoading(false);
  setEmail("");
  }

  return (
<div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 ">
  <div className='border-2 border-slate-300 m-auto p-6 rounded-md' >
    <div className="sm:mx-auto sm:w-full sm:max-w-sm ">
        <img className="mx-auto h-16 w-auto" src="https://th.bing.com/th/id/OIP.wlVtctNEeskBNhpk2H2UFQHaHa?pid=ImgDet&w=474&h=474&rs=1" alt="QuickCapture"/>
        <h1 className='text-center'>Quick Capture</h1>
        <h2 className="mt-6 text-center text-2xl/9 font-bold tracking-tight whitespace-nowrap text-gray-900 px-16">Change your password</h2>
    </div>

    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="space-y-6">
        <div className=' whitespace-nowrap' >
            <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">Email address</label>
            <div className="mt-2 flex justify-between gap-4">
                <input id="email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}  required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6 px-3" />
               
            </div>
        </div>

        <div>
            <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={sentOtp}
            >{isLoading ? <Spinner/> : "Get OTP"} </button>
        </div>
        </div>

        <p className="mt-5 text-center text-sm/6 text-gray-500">
        Have Credentials?
        <a href="/sign-in" className="font-semibold text-indigo-600 hover:text-indigo-500">Sign in</a>
        </p>
    </div>
  </div>
</div>
  )
}


