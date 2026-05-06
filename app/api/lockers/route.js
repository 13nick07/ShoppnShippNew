import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req) {
  const { shelfId, code } = await req.json();

  const col = await getCollection("lockers");

  const result = await col.insertOne({
    shelfId: new ObjectId(shelfId),
    code,
    isBooked: false,
    bookedBy: null,
    createdAt: new Date(),
  });

  return NextResponse.json({ success: true, data: result });
}