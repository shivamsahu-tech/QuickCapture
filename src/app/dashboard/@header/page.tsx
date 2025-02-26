'use client'
import { Spinner } from "@/components/ui/Spinner";
import { useNote } from "@/context/NoteContext";
import { useToast } from "@/hooks/use-toast";
import {  faArrowUpFromBracket, faCoffee, faIdBadge, faMagnifyingGlass, faRightFromBracket, faScaleBalanced } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Header() {
    const [hidden, setHidden] = useState(true);
    const router = useRouter();
    const menubarRef = useRef<HTMLDivElement | null>(null);
    const profileRef = useRef<HTMLDivElement | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [logoutLoading, setLogoutLoading] = useState(false);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const { toast } = useToast();
    const {isGuest, imageURL, setImageUploaderVisible} = useNote();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
    }, []);

    const handlePayment = async () => {
        setPaymentLoading(true);
        try {
          const orderResult = await fetch("/api/razorpay", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: 1, currency: "INR" }), // ₹5.00
          });
           
        //   console.log("order ": orderResult)
    
          const data = await orderResult.json();
          console.log("data ", data)
          if (!data.success) throw new Error("Order creation failed");
    
          const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Use public key for client-side
            amount: data.order.amount,
            currency: data.order.currency,
            name: "QuickCapture",
            description: "Test Payment",
            order_id: data.order.id,
            handler: function (response: any) {
              alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
              console.log(response);
            },
            theme: { color: "#3399cc" },
          };
    
          if (typeof window !== "undefined" && (window as any).Razorpay) {
                const rzp = new (window as any).Razorpay(options);
                rzp.open();
            } else {
                throw new Error("Razorpay SDK not loaded");
            }
        
        } catch (error) {
          console.error("Payment Error:", error);
        }
        setPaymentLoading(false);
      };

   

    const changePassword = async() => {
        if(isGuest){
            router.push(`/sign-up`);
            toast({
              variant: 'destructive',
              title: "Authorize Yourself!!",
              description: "sign in First"
            })
            return;
          }
        setIsLoading(true);
        try {
            const response = await fetch("/api/send-otp", {
                method: "POST"
            });
            if (response.ok) {
                toast({
                    title: "Successful!!",
                    description: "OTP sent successfully!!",
                    className: "bg-green-600",
                });
                router.push("/change-password");
            } else {
                toast({
                    variant: "destructive",
                    title: "Something went wrong!!",
                    description: "Please try again",
                });
            }
        } catch (error) {
            console.error("Error in send OTP : ", error)
            toast({
                variant: "destructive",
                title: "Something went wrong!!",
                description: "Please try again",
            });
        }
        setIsLoading(false);
    }

    const signOut = async () => {
        setLogoutLoading(true);
        if(isGuest){
            router.push(`/sign-up`);
            toast({
              variant: 'destructive',
              title: "Authorize Yourself!!",
              description: "sign in First"
            })
            return;
          }
        try {
            const response = await fetch("/api/sign-out");
            if (response.ok) {
                toast({
                    title: "Successful!!",
                    description: "User signed out successfully",
                    className: "bg-green-600",
                });
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
        router.push("/sign-up");
        setLogoutLoading(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                (menubarRef.current && !menubarRef.current.contains(event.target as Node)) &&
                (profileRef.current && !profileRef.current.contains(event.target as Node))
            ) {
                setHidden(true);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        setIsClient(true);
      }, []);
    
      if (!isClient) return null; 

    const setHiddenProperty = () => {
        setHidden((state) => !state);
    };

    return (
        <div className="w-full flex items-center">
            <div className="flex flex-1 justify-end items-center">
                <div className="flex items-center px-2 py-1.5 w-[90%] my-3 border-2 border-slate-200 rounded-3xl bg-slate-200 search-container">
                    <FontAwesomeIcon className="h-4 font-thin text-slate-600" icon={faMagnifyingGlass} />
                    <input
                        className="flex-1 px-3 outline-none font-mono bg-transparent"
                        placeholder="search for notes.."
                        spellCheck={false}
                        type="text"
                    />
                </div>
            </div>

            <div className="w-[15%] flex justify-center items-center relative">
                <div
                    className="h-12 w-12  rounded-[100%] cursor-pointer bg-white overflow-hidden border-2  border-blue-950 flex justify-center items-center"
                    onClick={setHiddenProperty}
                    ref={profileRef}
                >
                    <img
                        src={imageURL}
                        alt="avatar"
                        />
                </div>
                <div
                    className={`absolute z-10 w-auto whitespace-nowrap bg-slate-800 text-white top-[100%] right-0 flex flex-col p-1 rounded-md ${hidden ? "hidden" : ""}`}
                    ref={menubarRef}
                >

                    {/* for change password functionality */}
                    <div className="m-0.5 p-0.5 rounded-md hover:bg-slate-600  cursor-pointer r"
                         onClick={changePassword}
                    >
                        <h1 className="font-semibold text-sm">{isLoading ? <Spinner size={4} /> : "Change Password"}</h1>
                    </div>

                    {/* for profile image upload */}
                    <div className="flex justify-between m-0.5 p-0.5 rounded-md hover:bg-slate-600 cursor-pointer"
                    onClick={() => setImageUploaderVisible(true)}
                    >
                        <h1 className="font-semibold text-sm">Profile Photo</h1>
                        <label htmlFor="file-upload">
                            <FontAwesomeIcon className="px-1" icon={faArrowUpFromBracket} />
                        </label>                      
                       
                    </div>

                    {/* this is for payment purpose */}
                    <div className="m-0.5 py-0.5 pl-1  rounded-md hover:bg-slate-600  cursor-pointer flex  justify-between items-center"
                         onClick={handlePayment}
                    >
                        <h1 className="font-semibold text-sm">{paymentLoading ? <Spinner size={4} /> : "buy a coffee"}</h1>
                        <FontAwesomeIcon className="mr-1" icon={faCoffee} />
                    </div>

                    {/* contact us */}
                    <div
                        className="flex justify-between items-center m-0.5 p-0.5 px-1 rounded-md  hover:bg-slate-600 cursor-pointer"
                    >
                        <h1 className="font-semibold text-sm mr-4"><a href="/contact" >contact us</a></h1>
                        <FontAwesomeIcon className="mx-1" icon={faIdBadge} />
                    </div>

                    {/* term and conditions */}
                    <div
                        className="flex justify-between items-center m-0.5 p-0.5 px-1 rounded-md  hover:bg-slate-600 cursor-pointer"
                    >
                        <h1 className="font-semibold text-sm mr-4"><a href="/term&conds" >Term & Conds.</a></h1>
                        <FontAwesomeIcon icon={faScaleBalanced} />
                    </div>

                    {/* logout */}
                    <div
                        className="flex justify-between items-center m-0.5 p-0.5 px-1 rounded-md  hover:bg-slate-600 cursor-pointer"
                        onClick={signOut} // Attach signOut directly here
                    >
                        <h1 className="font-semibold text-sm mr-4">{logoutLoading ? <Spinner size={4} /> : "Logout"}</h1>
                        <FontAwesomeIcon icon={faRightFromBracket} />
                    </div>
                </div>
            </div>
        </div>
    );
}
