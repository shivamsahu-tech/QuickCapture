'use client'
import { useRef, useState } from "react";
import { Modal } from "./Modal";
import { useNote } from "@/context/NoteContext";
import { useToast } from "@/hooks/use-toast";
import { Spinner } from "./ui/Spinner";

export default function FileUpload() {
    const hiddenFileInput = useRef<HTMLInputElement | null>(null);
    const [image, setImage] = useState<File | null>(null);
    const {isImageUploaderVisible, setImageUploaderVisible, setImageURL} = useNote();
    const {toast} = useToast();
    const [isUploading, setIsUploading] = useState<boolean>(false);

    const handleClick = () => {
        if (hiddenFileInput.current) {
            hiddenFileInput.current.click();
        }
    };

    const exist = () => {
        setImageUploaderVisible(false);
        console.log("uploader visible : ", isImageUploaderVisible)
    }

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const imgname = file.name;
        const reader = new FileReader();

        reader.readAsDataURL(file);
        reader.onloadend = () => {
            if (!reader.result) return;

            const img = new Image();
            img.src = reader.result as string;

            img.onload = () => {
                const canvas = document.createElement("canvas");
                const maxSize = Math.max(img.width, img.height);
                canvas.width = maxSize;
                canvas.height = maxSize;

                const ctx = canvas.getContext("2d");
                if (!ctx) return; 

                ctx.drawImage(
                    img,
                    (maxSize - img.width) / 2,
                    (maxSize - img.height) / 2
                );

                canvas.toBlob((blob) => {
                    if (!blob) return; 

                    const file = new File([blob], imgname, {
                        type: "image/png",
                        lastModified: Date.now(),
                    });

                    console.log(file);
                    setImage(file);
                }, "image/jpeg", 0.8);
            };
        };
    };


    const uploadImage = async () => {
        setIsUploading(true);
        if (!image) {
            console.error("No image selected");
            toast({
                variant: 'destructive',
                title: "File Not Selected!",
                description: "Please select image."
              })
              setIsUploading(false)
            return;
        }
    
        const formData = new FormData();
        formData.append("profileImage", image);
    
        try {
            const response = await fetch("/api/upload-profileImage", {
                method: "POST",
                body: formData,
            });
            if (!response.ok) throw new Error("Upload failed");
    
            const data = await response.json();
            console.log("data: ", data)
            setImageURL(data.imageUrl);
            toast({
                title: "File Uploaded Successfully",
            })
            setImageUploaderVisible(false);

            console.log("Cloudinary URL:", data.imageUrl);
    
        } catch (error) {
            toast({
                variant: 'destructive',
                title: "File Upload Failed!!",
                description: "Please try again."
            })
            console.error("Error uploading image:", error);
        }
        setIsUploading(false);
        return;
    }
    

    return (
        <div className={`${isImageUploaderVisible ? "" : "hidden" }`} >
            <Modal  >
            <div className="min-w-[300px] w-[350px] h-[55%] bg-white border-dashed rounded-md border-gray-500 border-2 relative">
                <h1 className="absolute z-10 top-0 right-2 font-bold text-2xl rotate-45 cursor-pointer" onClick={exist} >+</h1>

                {/* this is image portion */}
                <div className="mx-[20%] mt-16 flex flex-col items-center relative">
                    <div onClick={handleClick} className="border-[2px] border-dashed border-black w-[250px] h-[250px] rounded-[50%] overflow-hidden relative cursor-pointer">
                        
                          {
                          image ? (
                                <img src={URL.createObjectURL(image)} alt="upload image" className="img-display-after" />
                            ) : (
                                <img
                                    src="https://png.pngtree.com/png-vector/20191129/ourlarge/pngtree-image-upload-icon-photo-upload-icon-png-image_2047547.jpg"
                                    alt="upload"
                                    className="w-[250px] h-[250px] absolute"
                                />
                            )
                           }

                        <div className="w-[100%] h-[100%] bg-slate-500 opacity-[0.3] absolute z-10 flex justify-center items-center">
                        </div>
                    </div>

                    <input type="file" style={{ display: 'none' }} ref={hiddenFileInput} onChange={handleImageChange} />

                    <button onClick={uploadImage} className="border-2 bg-blue-600 w-full border-blue-900 rounded-md text-xl font-semibold text-white py-1 mt-8">
                        {isUploading ? <Spinner/> : "Upload"}
                    </button>
                </div>
            </div>
        </Modal>
        </div>
    );
}
