import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req) {
  const { rackId, code } = await req.json();

  const col = await getCollection("shelves");

  const result = await col.insertOne({
    rackId: new ObjectId(rackId),
    code,
    isFullShelfBooked: false,
    createdAt: new Date(),
  });

  return NextResponse.json({ success: true, data: result });
}