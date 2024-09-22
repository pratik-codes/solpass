"use client";

import Image from "next/image";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { GlassButton } from "@/components/ui/button";
import { Pencil, Trash, Copy, Eye } from "lucide-react";
import { copyToClipboard } from "@/lib/utils";
import PasswordEditAdd from "@/components/dashboard/add-edit-password";
import { Link } from "@/app/home/page";
import { toast } from "sonner";

export default function PasswordDetails({
  title,
  url,
  userName,
  email,
  notes,
  id,
  type,
  password,
  vault,
  editLink,
  deleteLink,
}: {
  id: string;
  title: string;
  url: string;
  userName: string;
  email: string;
  notes: string;
  type: string;
  password: string;
  vault: any;
  editLink?: (id: string, link: Link) => void;
  deleteLink?: (id: string) => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const parsedUrl = new URL(url);

  return (
    <div className="mt-8 w-11/12 mx-auto p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Image
            className="rounded-full p-0"
            width={70}
            height={70}
            src={`https://logo.clearbit.com/${parsedUrl.host}`}
            alt="favicon"
          />
          <div>
            <h1 className="text-2xl font-bold">{title}</h1>
            <Badge className="text-xs bg-blue-700 font-light text-white">
              {type}
            </Badge>
          </div>
        </div>

        <div className="flex space-x-2">
          <PasswordEditAdd
            vault={vault}
            editPasswordId={id}
            editLink={(id: string, link: Link) => editLink && editLink(id, link)}
            type="edit"
            password={{
              title,
              url,
              userName,
              email,
              notes,
              type,
              password,
            }}
          />
          <GlassButton onClick={() => {
            if (deleteLink) {
              deleteLink(id);
              toast.success("Password deleted successfully");
            }
          }}  className="hover:text-red-800">
            <Trash size={20} />
          </GlassButton>
        </div>
      </div>

      <Separator className="my-[3rem]" />

      <div>
        <div className="flex flex-col p-1 space-y-1 rounded-xl px-3 py-5 hover:bg-charcol">
          <label className="text-md font-light text-gray-400">Website</label>
          <a
            href={url}
            className="hover:text-blue-700 hover:underline text-lg font-medium text-white">
            {url}{" "}
          </a>
        </div>
        <div className="p-1 space-y-1 rounded-xl px-3 py-5 hover:bg-charcol">
          <label className="text-md font-light text-gray-400">Username</label>
          <p className="text-lg font-medium text-white">@{userName} </p>
        </div>
        <div className="p-1 space-y-1 rounded-xl px-3 py-5 hover:bg-charcol">
          <label className="text-md font-light text-gray-400">email</label>
          <p className="text-lg font-medium text-white">{email} </p>
        </div>
        <div className="flex justify-between p-1 space-y-1 rounded-xl px-3 py-5 hover:bg-charcol">
          <div className="flex flex-col jusitfy-between">
            <label className="text-md font-light text-gray-400">Password</label>
            <p className="text-lg font-medium text-white">
              {showPassword ? password : "**************"}{" "}
            </p>
          </div>
          <div className="space-x-2">
            <GlassButton
              onClick={() => {
                console.log(showPassword);
                setShowPassword(!showPassword);
              }}
              className="hover:text-blue-800">
              <Eye size={16} />
            </GlassButton>
            <GlassButton
              onClick={() => copyToClipboard(password)}
              className="hover:text-blue-800">
              <Copy size={16} />
            </GlassButton>
          </div>
        </div>
      </div>

      <Separator className="my-[3rem]" />

      <div className="p-1 space-y-1 rounded-xl px-3 py-5 hover:bg-charcol overflow-hidden">
        <label className="text-md font-light text-gray-400">Notes</label>
        <p className="text-lg font-medium text-white">{notes}</p>
      </div>
    </div>
  );
}
