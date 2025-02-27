"use client"
import { ReactNode, use } from "react"
import DashboardSideBar from "./_components/dashboard-side-bar"
import DashboardTopNav from "./_components/dashbord-top-nav"
import { useWallet ,useConnection} from "@solana/wallet-adapter-react";
import { transfer2Sol } from "@/utils/functions/solana/transfer2Sol";

import { useEffect,useState } from "react";
import { getKeys } from "@/lib/utils";

export default function DashboardLayout({ children }: { children: ReactNode }) {


   const [open,setOpen]=useState(true)
  useEffect(() => {
    async function checkdeposit(){

      const { publicKey } = getKeys()

      const response = await fetch("/api/deposit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ publicKey }),
    });

    const data = await response.json();
    if (data.deposited) {
      setOpen(false)


    }

    }


  })

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <DashboardSideBar />
      <DashboardTopNav >
        <main className="flex flex-col gap-4 lg:gap-6 h-full">
          {children}
        </main>

      </DashboardTopNav>
      { open ? <Popup/>:null}
    </div>
  )
}



export  function Popup() {

  const { publicKey, sendTransaction, signMessage } = useWallet();
  const { connection } = useConnection();




  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
        <h2 className="text-xl font-bold mb-4">To Start using!!</h2>
        <p>Transfer two solana.</p>
        <button
        // @ts-ignore
          onClick={() => transfer2Sol({publicKey, signMessage, sendTransaction, connection})}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
}
