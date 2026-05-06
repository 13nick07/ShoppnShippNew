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

    const user = verifyTokenAndUser(token);
    if (!user) {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
    }

    const { warehouseId, bookingType } = await req.json();

    const warehouses = await getCollection("warehouses");
    const racks = await getCollection("racks");
    const shelves = await getCollection("shelves");
    const lockers = await getCollection("lockers");
    const addresses = await getCollection("addresses");

    const warehouse = await warehouses.findOne({
      _id: new ObjectId(warehouseId)
    });

    if (!warehouse) {
      console.log(warehouse+" "+warehouseId)
      return NextResponse.json({ success: false, message: "Warehouse not found" }, { status: 404 });
    }

    let lockerDoc = null;
    let shelfDoc = null;

    // 🔸 LOCKER BOOKING
    if (bookingType === "LOCKER") {

      lockerDoc = await lockers.findOneAndUpdate(
        {
          isBooked: false,
          // ✅ IMPORTANT FIX (if you add warehouseId later)
          // warehouseId: new ObjectId(warehouseId)
        },
        {
          $set: {
            isBooked: true,
            bookedBy: user.userId,
            bookedAt: new Date()
          }
        },
        { returnDocument: "after" }
      );

      if (!lockerDoc) {
        return NextResponse.json(
          { success: false, message: "No lockers available" },
          { status: 400 }
        );
      }

      shelfDoc = await shelves.findOne({
        _id: lockerDoc.shelfId
      });
    }

    console.log("locker finished");

    // 🔸 SHELF BOOKING
    if (bookingType === "SHELF") {

      // 1. Find candidate shelves
      const shelvesList = await shelves
        .find({ isFullShelfBooked: false })
        .toArray();

      let selectedShelf = null;

      for (const shelf of shelvesList) {

        // 2. Check if ANY locker is booked
        const bookedCount = await lockers.countDocuments({
          shelfId: shelf._id,
          isBooked: true
        });

        if (bookedCount === 0) {
          selectedShelf = shelf;
          break;
        }
      }

      if (!selectedShelf) {
        return NextResponse.json(
          { success: false, message: "No valid shelves available" },
          { status: 400 }
        );
      }

      // 3. Atomically update shelf
      shelfDoc = await shelves.findOneAndUpdate(
        {
          _id: selectedShelf._id,
          isFullShelfBooked: false // safety lock
        },
        {
          $set: {
            isFullShelfBooked: true,
            bookedBy: user.userId,
            bookedAt: new Date()
          }
        },
        { returnDocument: "after" }
      );

      if (!shelfDoc) {
        return NextResponse.json(
          { success: false, message: "Shelf already taken" },
          { status: 400 }
        );
      }

      // 4. Mark all lockers
      await lockers.updateMany(
        { shelfId: selectedShelf._id },
        {
          $set: {
            isBooked: true,
            bookedBy: user.userId,
            bookedAt: new Date()
          }
        }
      );
    }
    console.log("shelf finished");

    const rack = await racks.findOne({
      _id: shelfDoc.rackId
    });

    console.log("rack finished");

    const userCode = `${warehouse.warehouseCode}${rack.code}${shelfDoc.code}${lockerDoc?.code || ""}`;

    // ✅ FIXED STRING TEMPLATE
    const addressLine = `${warehouse.city}, ${warehouse.country} - ${userCode}`;

    const newAddress = {
      userId: user.userId,
      userEmail: user.email,
      warehouseId: warehouse._id,
      warehouse: { country: warehouse.country, city: warehouse.city, },
      rackId: rack._id,
      shelfId: shelfDoc._id,
      lockerId: lockerDoc?._id || null,
      bookingType,
      addressLine,
      userCode,
      createdAt: new Date()
    };

    await addresses.insertOne(newAddress);

    return NextResponse.json({
      success: true,
      data: newAddress
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

export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = verifyTokenAndUser(token);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    const addressesCollection = await getCollection("addresses");

    const addresses = await addressesCollection
      .find({ userId: user.userId })
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