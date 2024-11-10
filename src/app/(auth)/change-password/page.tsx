"use client"
import { Spinner } from '@/components/ui/Spinner';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

export default function Page() {

  const [isValidPassword, setIsValidPassword] = useState(true);
  const [isPasswordSame, setIsPasswordSame] = useState(true);
  const [password, setPassword] = useState("");
  const [cnfPassword, setCnfPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState<number>();
  const [msg, setMsg] = useState("");
  const {toast} = useToast();
  const router = useRouter();

  const submit = async() => {
    setIsLoading(true);
    try {
      const result = await fetch("/api/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ otp, password })
      });
      console.log("sign up result : ", result);
      const data = await result.json();
      if(result.ok){
        toast({
          title: "Successfull!!",
          description: "password change successfull",
          className: "bg-green-600"
        });
        router.push("/sign-in");
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
    setPassword("");
    setCnfPassword("");
    setIsLoading(false);
}

  useEffect(() => {
    if(!isValidPassword || !isPasswordSame){
      if(!isValidPassword){
        setMsg("Password should be atleast 8 character")
      }
      else if(!isPasswordSame){
        setMsg("Password didn't match")
      }
    }
    else {
      setMsg("")
    }
  }, [password, isPasswordSame, isValidPassword]); 



  return (
  <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 ">
    <div className='border-2 border-slate-300 m-auto p-6 rounded-md' >
      <div className="sm:mx-auto sm:w-full sm:max-w-sm ">
          <img className="mx-auto h-16 w-auto" src="https://th.bing.com/th/id/OIP.wlVtctNEeskBNhpk2H2UFQHaHa?pid=ImgDet&w=474&h=474&rs=1" alt="QuickCapture"/>
          <h1 className='text-center'>Quick Capture</h1>
          <h2 className="mt-6 text-center text-2xl/9 font-bold tracking-tight text-gray-900 px-16">Create New Password</h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="space-y-6">
          <div>
              <label htmlFor="otp" className="block text-sm/6 font-medium text-gray-900">Enter OTP</label>
              <div className="mt-2">
              <input id="otp" name="otp" type="text" value={otp} onChange={(e) => setOtp(Number(e.target.value))}  required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6 px-3" />
              </div>
          </div>

          <div>
              <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">Password</label>
              <div className="mt-2">
              <input id="password" value={password} type="password"  
              required className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:outline-none  focus:ring-indigo-600 sm:text-sm/6 px-3 ${isValidPassword ? "" : "ring-red-800 focus:ring-red-800"}`} 
              onChange={(e) => {setIsValidPassword(e.target.value.length >= 8); setPassword(e.target.value)}}
              />
              </div>
          </div>

          <div>
              <label htmlFor="cnfpassword" className="block text-sm/6 font-medium text-gray-900">Confirm Password</label>
              <div className="mt-2">
              <input id="cnfpassword" name="cnfpassword" type="password" value={cnfPassword}  required className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:outline-none  focus:ring-indigo-600 sm:text-sm/6 px-3 ${isPasswordSame ? "" : "ring-red-800 focus:ring-red-800"}`} 
              onChange={(e) => {setIsPasswordSame(e.target.value == password); setCnfPassword(e.target.value)}}
               />
              </div>
          </div>

          

          <div>
              <p
              className='text-xs font-semibold py-2 text-red-900 transition-all mx-2' 
              >{msg}</p>
              <button type="submit" 
              className={`flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600  ${(isValidPassword && isPasswordSame) ? "cursor-pointer" : "cursor-not-allowed "} `} 
              disabled={!(isValidPassword && isPasswordSame)}
              onClick={submit}
              >{isLoading ? <Spinner/> : "Submit"} </button>
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






