import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";

export async function GET() {
  try {
    const warehousesCollection = await getCollection("warehouses");

    const warehouses = await warehousesCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      data: warehouses,
    });
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

    const warehousesCollection = await getCollection("warehouses");

    const warehouse = {
      warehouseCode: body.warehouseCode.trim().toUpperCase(),
      name: body.name.trim(),
      countryCode: body.countryCode.trim().toUpperCase(),
      country: body.country.trim(),
      city: body.city.trim(),
      addressLine: body.addressLine.trim(),
      postalCode: body.postalCode?.trim() || "",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await warehousesCollection.insertOne(warehouse);

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