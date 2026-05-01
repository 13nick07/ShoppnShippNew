import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req) {
  const { warehouseId, code } = await req.json();

  const col = await getCollection("racks");

  const result = await col.insertOne({
    warehouseId: new ObjectId(warehouseId),
    code,
    createdAt: new Date(),
  });

  return NextResponse.json({ success: true, data: result });
}