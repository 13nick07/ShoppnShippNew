import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb"; // Needed to query by _id

export async function GET(req, { params }) {
  try {
    const countriesCollection = await getCollection("countries");

    const country = await countriesCollection.findOne({ _id: new ObjectId(params.id) });

    if (!country) {
      return NextResponse.json(
        { success: false, message: "Country not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: country });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    const body = await req.json();
    const countriesCollection = await getCollection("countries");

    const updatedCountry = await countriesCollection.findOneAndUpdate(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          ...body,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" } // returns the updated document
    );

    return NextResponse.json({ success: true, data: updatedCountry.value });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const countriesCollection = await getCollection("countries");

    const result = await countriesCollection.deleteOne({ _id: new ObjectId(params.id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Country not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}