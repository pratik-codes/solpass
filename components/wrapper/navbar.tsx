"use client"
import Link from 'next/link';
import * as React from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { UserProfile } from "../user-profile";
import ModeToggle from "../mode-toggle";
import { BlocksIcon, ChevronRight } from "lucide-react";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import config from "@/config";
import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";
import { Dialog, DialogClose } from "@radix-ui/react-dialog";
import Image from "next/image";
import IconImage from "@/assets/icon.png";

const components: { title: string; href: string; description: string }[] = [
    {
        title: "Marketing Page",
        href: "/marketing-page",
        description: "Write some wavy here to get them to click.",
    },
    {
        title: "Marketing Page",
        href: "/marketing-page",
        description: "Write some wavy here to get them to click.",
    },
    {
        title: "Marketing Page",
        href: "/marketing-page",
        description: "Write some wavy here to get them to click.",
    },
];

export default function NavBar() {
    let userId = null;
    if (config?.auth?.enabled) {
        const user = useAuth();
        userId = user?.userId;
    }

    return (
        <div className='flex'>
            <div className="flex min-w-full fixed justify-between p-2 border-b z-10 dark:bg-black dark:bg-opacity-50 bg-white">
                <div className="flex justify-between w-full min-[825px]:hidden">
                    <Dialog>
                        <SheetTrigger className="p-2 transition">
                            <Button
                                size="icon"
                                variant="ghost"
                                className="w-4 h-4"
                                aria-label="Open menu"
                                asChild>
                                <GiHamburgerMenu />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left">
                            <SheetHeader>
                                <SheetTitle>Next Starter</SheetTitle>
                            </SheetHeader>
                            <div className="flex flex-col space-y-3 mt-[1rem]">
                                <DialogClose asChild>
                                    <Link href="/">
                                        <Button variant="outline" className="w-full">
                                            Home
                                        </Button>
                                    </Link>
                                </DialogClose>
                                <DialogClose asChild>
                                    <Link
                                        href="/home"
                                        legacyBehavior
                                        passHref
                                        className="cursor-pointer">
                                        <Button variant="outline" className='rounded-xl'>Home</Button>
                                    </Link>
                                </DialogClose>
                            </div>
                        </SheetContent>
                    </Dialog>
                    <ModeToggle />
                </div>
                <NavigationMenu>
                    <NavigationMenuList className="max-[825px]:hidden flex gap-3 w-[100%] justify-between">
                        <Link
                            href="/"
                            className="pl-2 flex items-center mr-4"
                            aria-label="Home">
                            <div className="flex space-x-6 items-center font-bold">
                                <Image
                                    src={IconImage}
                                    alt="Logo"
                                    width={35}
                                    height={35}
                                    className="mr-2"
                                />
                                Solpass
                            </div>
                            <span className="sr-only">Home</span>
                        </Link>
                    </NavigationMenuList>
                    <NavigationMenuList>
                        <NavigationMenuItem className="max-[825px]:hidden">
                            <Link href="/home" legacyBehavior passHref>
                                <Button variant="ghost" className='rounded-xl'>Home</Button>
                            </Link>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
                <div className="flex items-center gap-2 max-[825px]:hidden">
                    {userId && <UserProfile />}
                    <Link
                        href="/anonymous"
                        className="rounded-xl inline-flex text-center group items-center w-full justify-center bg-gradient-to-tr from-zinc-300/5 via-gray-400/5 to-transparent bg-transparent  border-input border-[1px] hover:bg-transparent/10 transition-colors sm:w-auto py-2 px-4 text-sm">
                        Login
                        <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 duration-300" />
                    </Link>

                    {/* <ModeToggle /> */}
                </div>
            </div>

        </div>
    );
}

const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    );
});
ListItem.displayName = "ListItem";
