import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const {
      warehouseId,
      racks = 1,
      shelvesPerRack = 6,
      lockersPerShelf = 3,
    } = await req.json();

    const warehouses = await getCollection("warehouses");
    const racksCol = await getCollection("racks");
    const shelvesCol = await getCollection("shelves");
    const lockersCol = await getCollection("lockers");

    const warehouse = await warehouses.findOne({
      _id: new ObjectId(warehouseId),
    });

    if (!warehouse) {
      return NextResponse.json(
        { success: false, message: "Warehouse not found" },
        { status: 404 }
      );
    }

    // 🔥 CREATE STRUCTURE
    for (let r = 1; r <= racks; r++) {
      const rack = await racksCol.insertOne({
        warehouseId: warehouse._id,
        code: `R${r}`,
        createdAt: new Date(),
      });

      for (let s = 1; s <= shelvesPerRack; s++) {
        const shelf = await shelvesCol.insertOne({
          rackId: rack.insertedId,
          code: `S${String.fromCharCode(64 + s)}`, // SA, SB
          isFullShelfBooked: false,
          createdAt: new Date(),
        });

        for (let l = 1; l <= lockersPerShelf; l++) {
          await lockersCol.insertOne({
            shelfId: shelf.insertedId,
            code: `L${l}`,
            isBooked: false,
            bookedBy: null,
            createdAt: new Date(),
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Warehouse structure created successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false,
        message: error.message
      },
      { status: 500 }
    );
  }
}