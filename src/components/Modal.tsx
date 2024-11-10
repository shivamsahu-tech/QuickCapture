"use client"

import {
    Dialog,
    DialogOverlay,
} from "./ui/dialog"

export function Modal({
    children,
}: {
    children: React.ReactNode
}) {
    

    return (
        <Dialog defaultOpen={true} open={true}>
            <DialogOverlay>
               <div className=" w-full h-[100vh] flex justify-center items-center"   >
                 {children}
               </div>
            </DialogOverlay>
        </Dialog>
    )
}