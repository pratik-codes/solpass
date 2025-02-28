import { NextResponse } from "next/server";
import  prisma  from "@/lib/prisma"; // Adjust path if necessary

export async function POST(req: Request) {
    try {
        const { publicKey, payedAdress, deposited } = await req.json();

        // Validate request body
        if (!publicKey || !payedAdress) {
            return NextResponse.json({ error: "publicKey and payedAdress are required" }, { status: 400 });
        }

        // Create a new record in the "anonymous" table
        const newRecord = await prisma.ananymous.create({
            data: {
                publicKey,
                payedAdress,
                deposited: deposited ?? false, // Default to false if not provided
            },
        });

        return NextResponse.json({ success: true, newRecord }, { status: 201 });
    } catch (error: any) {
        console.error("Error creating anonymous record:", error);

        // Handle unique constraint violation
        if (error.code === "P2002") {
            return NextResponse.json({ error: "publicKey already exists" }, { status: 409 });
        }

        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
