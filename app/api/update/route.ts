import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const { publicKey, deposited } = await req.json();

        // Validate request body
      

        // Find and update the record
        const updatedRecord = await prisma.ananymous.update({
            where: {publicKey: publicKey },
            data: {deposited: true },
        });

        console.log("Record updated:", updatedRecord);

        return NextResponse.json(
            { success: true, updatedRecord },
            { status: 200 }
        );

    } catch (error: any) {
        console.error("Error updating record:", error);

        // Handle case where publicKey does not exist
        if (error.code === "P2025") {
            return NextResponse.json(
                { error: "publicKey not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
