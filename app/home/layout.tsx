"use client";
import { ReactNode, use } from "react";
import DashboardSideBar from "./_components/dashboard-side-bar";
import DashboardTopNav from "./_components/dashbord-top-nav";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { transfer2Sol } from "@/utils/functions/solana/transfer2Sol";

import { useEffect, useState } from "react";
import { getKeys } from "@/lib/utils";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(true);
  useEffect(() => {
    async function checkdeposit() {
      const { publicKey } = getKeys();

      const response = await fetch("/api/deposit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ publicKey }),
      });

      const data = await response.json();
      if (data.deposited) {
        setOpen(false);
      }
    }
    checkdeposit();

  });

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <DashboardSideBar />
      <DashboardTopNav>
        <main className="flex flex-col gap-4 lg:gap-6 h-full">{children}</main>
      </DashboardTopNav>
      {open ? <Popup /> : null}
    </div>
  );
}

export function Popup() {
  const { publicKey, sendTransaction, signMessage } = useWallet();
  const { connection } = useConnection();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-lg z-50">
    <div className="bg-black/40 backdrop-blur-md p-8 rounded-xl shadow-2xl w-96 text-center border border-white/20">
      <h2 className="text-2xl font-bold mb-4 text-white">Ready to Start!</h2>
      
      <div className="mb-6 p-4 bg-white/10 rounded-lg border border-white/10">
        <p className="text-white">Transfer two SOL to continue.</p>
      </div>
      
      <button
        // @ts-ignore
        onClick={() =>
          transfer2Sol({
            publicKey,
            //@ts-ignore
            signMessage,
            sendTransaction,
            connection,
          })
        }
        className="mt-4 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium shadow-md hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
      >
        Continue
      </button>
    </div>
  </div>
  
  );
}