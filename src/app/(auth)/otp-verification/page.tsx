'use client'
import { Spinner } from '@/components/ui/Spinner';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

function page() {

  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading]  = useState(false);
  const {toast} = useToast();
  const router = useRouter();

  const submit = async() => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/otp-verification",{
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ otp })
      })
      if(response.ok){
        toast({
          title: "Verified",
          description: "User verified successfully",
          className: "bg-green-600"
        });
        router.push("/");
      }else{
        toast({
          variant: 'destructive',
          title: "some thing went wrong",
          description: "Please Try again",
        });
      }
    } catch (error) {
        console.log("otp error : ", error)
    }
    setOtp("");
    setIsLoading(false);
  }


  return (
<div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 ">
  <div className='border-2 border-slate-300 m-auto p-6 rounded-md' >
    <div className="sm:mx-auto sm:w-full sm:max-w-sm ">
        <img className="mx-auto h-16 w-auto" src="https://th.bing.com/th/id/OIP.wlVtctNEeskBNhpk2H2UFQHaHa?pid=ImgDet&w=474&h=474&rs=1" alt="QuickCapture"/>
        <h1 className='text-center'>Quick Capture</h1>
        <h2 className="mt-6 text-center text-2xl/9 font-bold tracking-tight whitespace-nowrap text-gray-900 px-16">Verify Your Account</h2>
    </div>

    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="space-y-6">
        <div className=' whitespace-nowrap' >
            <label htmlFor="otp" className="block text-sm/6 font-medium text-gray-900">Enter OTP: <span className='text-xs' > (valid till 15min)</span> </label>
            <div className="mt-2 flex justify-between gap-4">
                <input id="otp" name="otp" type="otp"  required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6 px-3" 
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                />
               
            </div>
        </div>

        <div>
            <button  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={submit}
            >{isLoading ? <Spinner/> : "Submit" }</button>
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

export default page
