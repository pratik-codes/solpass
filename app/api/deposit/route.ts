


import { NextResponse } from "next/server";
import  prisma  from "@/lib/prisma"; // Adjust the import path if needed

export async function POST(req: Request) {
    try {
        const { publicKey } = await req.json();

        if (!publicKey) {
            return NextResponse.json({ error: "publicKey is required" }, { status: 400 });
        }

        // Check if publicKey exists in the database
        const ananymous = await prisma.ananymous.findFirst({
            where: {  publicKey },
        });

        if (ananymous) {
            return NextResponse.json({ deposited: ananymous.deposited }, { status: 200 });
        } else {
            return NextResponse.json({ deposited: false }, { status: 404 });
        }
    } catch (error) {
        console.error("Error checking publicKey:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
