"use client"

import { Separator } from '@/components/ui/separator'
import clsx from 'clsx'
import {
  Banknote,
  Folder,
  Vault,
  Settings
} from "lucide-react"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from "next/image";
import IconImage from "@/assets/icon.png";

export default function DashboardSideBar() {
  const pathname = usePathname();

  return (
    <div className="lg:block hidden border-r h-full">
      <div className="flex h-full max-h-screen flex-col gap-2 ">
        <div className="flex h-[55px] items-center justify-between border-b px-3 w-full">
          <Link className="flex items-center gap-2 font-semibold ml-1" href="/">
                <div className="flex space-x-6 items-center font-bold">
                  <Image
                    src={IconImage}
                    alt="Logo"
                    width={35}
                    height={35}
                    className="mr-2"
                  />
                  SolPass
                </div>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2 ">
          <nav className="grid items-start px-4 text-sm font-medium">
            <Link
              className={clsx("flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50", {
                "flex items-center gap-2 rounded-lg bg-blue-100 px-3 py-2 text-gray-900  transition-all hover:text-gray-900 dark:bg-blue-700 dark:text-gray-50 dark:hover:text-gray-50": pathname === "/home"
              })}
              href="/home"
            >
              <div className="border rounded-lg dark:bg-gray-900 dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Vault className="h-4 w-4" />
              </div>
              Vaults
            </Link>
            <Separator className="my-3" />
            <Link
              className={clsx("flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50", {
                "flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-gray-900  transition-all hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50": pathname === "/dashboard/settings"
              })}
              href="/home/settings"
              id="onboarding"
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Settings className="h-3 w-3" />
              </div>
              Settings
            </Link>
          </nav>
        </div>
      </div>
    </div>
  )
}
