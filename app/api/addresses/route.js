import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { verifyTokenAndUser } from "@/lib/auth";

export async function POST(req) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    
    const user = verifyTokenAndUser(token); // decode JWT → returns { id, email, role }

    if (!user) {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
    }

    const body = await req.json();

    const { userId, userEmail, warehouseId } = body;

    const addressesCollection = await getCollection("addresses");

    // 🔹 If warehouseId exists → CREATE address
    if (warehouseId) {
      const warehousesCollection = await getCollection("warehouses");

      const warehouse = await warehousesCollection.findOne({
        _id: new ObjectId(warehouseId),
      });

      if (!warehouse) {
        return NextResponse.json(
          { success: false, message: "Warehouse not found" },
          { status: 404 }
        );
      }

      const userCode = Math.random().toString(36).substring(2, 8).toUpperCase();

      const virtualAddress = {
        userId: user.userId,
        userEmail: user.email,
        warehouseId: warehouse._id,
        warehouse: {
          country: warehouse.country,
          city: warehouse.city,
        },
        addressLine: `${warehouse.city}, ${warehouse.country} - ${userCode}`,
        userCode,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await addressesCollection.insertOne(virtualAddress);

      return NextResponse.json({
        success: true,
        data: virtualAddress,
      });
    }

    // 🔹 Otherwise → FETCH user addresses
    const addresses = await addressesCollection
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      data: addresses,
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}