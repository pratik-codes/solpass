"use client"

import { Trash } from "lucide-react";
import Image from "next/image";
import { GlassButton } from "@/components/ui/button";            
import { toast } from "sonner";

export default function VaultCard({
     title,
     url,
     userName,
     email,
     notes,
     setCurrentPasswordHandler,
     id,
     type,
  currentPassword,
  deleteLink,
}: {
     id: string;
     title: string;
     url: string;
     userName: string;
     email: string;
     notes: string;
     type: string;
     currentPassword: any;
    setCurrentPasswordHandler: (id: string) => void;
    deleteLink: (id: string) => void;
}) {
     const parsedUrl = new URL(url);

     return (
       <div
         onClick={() => setCurrentPasswordHandler(id)}
         className={`p-4 flex group items-center space-x-4 mb-1 rounded-xl hover:bg-charcol cursor-pointer transition duration-200 mb-2 ${
           currentPassword?.id === id ? "bg-blue-700 hover:bg-charcol" : ""
         }`}>
         <div className="rounded-full bg-gray-800">
           <Image
             className="rounded-full p-0"
             width={50}
             height={50}
             src={`https://logo.clearbit.com/${parsedUrl.host}`}
             alt="favicon"
           />
         </div>
         <div className="flex items-center justify-between w-full">
           <div className="">
             <h1 className="text-md text-gray-300 font-bold font-geist tracking-tighter">
               {title}
             </h1>
             <div className="flex items-center">
               {userName && (
                 <p className="text-xs font-medium text-gray-400 ml-1">
                   @{userName} -{" "}
                 </p>
               )}
               {email && (
                 <p className="text-xs font-medium text-gray-400 ml-1">
                   {email}
                 </p>
               )}
             </div>
           </div>

           <GlassButton onClick={(e) => {
              e.stopPropagation();
              if (deleteLink) {
                deleteLink(id);
                toast.success("Password deleted successfully");
             }
          }} className="py-0 px-2 opacity-0 hover:bg-red-800 group-hover:opacity-100">
             <Trash size={20} />
           </GlassButton>
         </div>
       </div>
     );
}
