"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlassButton } from "@/components/ui/button";
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Pencil } from "lucide-react";
import { Link } from "@/app/home/page";
import { toast } from "sonner";

export default function PasswordEditAdd({
  type,
  vault,
  addLink,
  editLink,
  password,
  editPasswordId,
}: {
    type: string;
    vault?: any;
    editPasswordId?: string;
    password?: Link;
    addLink?: (link: Link) => void;
    editLink?: (id: string, link: Link) => void;
  }) {
  const [loading, setLoading] = useState(false);
  const [addType, setAddType] = useState(true);
  const types: Array<string> = vault?.passwords?.map(
    (password: any) => password.type
  );
  const uniqueTypes = Array.from(new Set(types));

  const [formData, setFormData] = useState({
    title: password?.title || "",
    url: password?.url || "",
    userName: password?.userName || "",
    email: password?.email || "",
    password: password?.password || "",
    type: password?.type || "",
    notes: password?.notes || "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      type: value,
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault(); 
    console.log("form data", formData);

    if (!formData.title || !formData.url || !formData.password) {
      toast.error("Please fill in all required fields");
      return;
    }

    // regex to check if url is valid
    const urlRegex = /^(https?:\/\/)?[^\s]+$/;
    if (!urlRegex.test(formData.url)) {
      toast.error("Please enter a valid url");
      return;
    }

    // regex to check if email is valid
    const emailRegex = /\S+@\S+\.\S+/;
    if (formData.email && !emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email");
      return;
    }

    const cleanUrl = formData.url.replace("https://", "").replace("http://", "");
    const url = `https://${cleanUrl}`;
    formData.url = url;
    setLoading(true);
    if (type === "add" && addLink) {
      addLink(formData);
      toast.success("Password added successfully");
    }
    
    if (type === "edit" && editLink) {
      editLink(editPasswordId || "", formData);
      toast.success("Password updated successfully");
    }

    setLoading(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <GlassButton>{type === "add" ? "Add" :   <Pencil size={20} />}</GlassButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{type === "add" ? "Add" : "Edit"}</DialogTitle>
          <DialogDescription>
            {type === "add" ? "Add a new password" : "Edit your password"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleFormSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="url" className="text-right">
                Website url
              </Label>
              <Input
                id="url"
                value={formData.url}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="userName" className="text-right">
                Username
              </Label>
              <Input
                id="userName"
                value={formData.userName}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Password
              </Label>
              <Input
                id="password"
                value={formData.password}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <div className="flex items-center space-x-2">
                <div>
                  {addType ? (
                    <Select onValueChange={handleSelectChange} defaultValue={password?.type}>
                      <SelectTrigger className="w-[11rem] rounded-xl">
                        <SelectValue placeholder="Select a type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {uniqueTypes.map((type: string) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      placeholder="enter type"
                      className="w-[11rem]"
                    />
                  )}
                </div>
                <GlassButton
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setAddType(!addType);
                  }}>
                  {addType ? "Add new" : "Select"}
                </GlassButton>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Notes
              </Label>
              <Textarea
                id="notes"
                maxLength={100}
                value={formData.notes}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <GlassButton disabled={loading} type="submit">
              {loading ? <Loader2 size={20} className="mr-2" /> : null}
              {type === "edit" ? "Edit password" : "Add password"}
            </GlassButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
