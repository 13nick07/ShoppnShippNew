import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";

export async function GET() {
  try {
    const countriesCollection = await getCollection("countries");

    const countries = await countriesCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ success: true, data: countries });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();

    const countriesCollection = await getCollection("countries");

    const country = {
      name: body.name.trim(),
      flag: body.flag,
      code: body.code.trim().toUpperCase(),
      cities: body.cities || [],
      description: body.description?.trim() || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await countriesCollection.insertOne(country);

    return NextResponse.json(
      { success: true, data: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}