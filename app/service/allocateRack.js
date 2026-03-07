import mongoose from "mongoose";
import Rack from "@/models/Rack";
import Shelf from "@/models/Shelf";
import Warehouse from "@/models/Warehouse";
import { canAllocateRack } from "./lockRelease";

/**
 * Allocate a rack for a user
 * Auto-locks shelf when all racks are allocated
 * @param {Object} params
 * @param {string} params.country
 * @param {string} params.state
 * @param {Object} params.user - Mongoose User document
 * @returns {string} rackId - e.g. W1S2R5
 */
export const allocateRack = async ({ country, state, user }) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find warehouse
    const warehouse = await Warehouse.findOne({ country, state }, null, { session });
    if (!warehouse) throw new Error("Warehouse not found");

    // Optional: limit Free users to 1 rack
    if (user.membershipPlan === "Free") {
      const existingRack = await Rack.findOne({ allocatedTo: user._id }, null, { session });
      if (existingRack) {
        throw new Error("Free users can allocate only one rack");
      }
    }

    // Find all unlocked shelves in the warehouse
    const shelves = await Shelf.find({ warehouse: warehouse._id, isLocked: false }, null, { session });
    if (!shelves.length) throw new Error("No unlocked shelves available");

    let allocatedRack = null;

    // Loop through unlocked shelves to find a free rack
    for (const shelf of shelves) {

      // Find first available rack in this shelf
      const rack = await Rack.findOne({
        warehouse: warehouse._id,
        shelf: shelf._id,
        isLocked: false,
        allocatedTo: null
      }, null, { session });

      if (rack && await canAllocateRack(rack._id)) {
        // Allocate rack
        rack.isLocked = true;
        rack.allocatedTo = user._id;
        rack.allocatedAt = new Date();
        await rack.save({ session });
        allocatedRack = { rack, shelf };

        // ✅ Auto-lock shelf if all racks are now locked
        const unlockedRacks = await Rack.countDocuments({
          shelf: shelf._id,
          isLocked: false,
          allocatedTo: null
        }, { session });

        if (unlockedRacks === 0) {
          shelf.isLocked = true;
          await shelf.save({ session });
        }

        break;
      }
    }

    if (!allocatedRack) throw new Error("No racks available for allocation");

    await session.commitTransaction();
    session.endSession();

    // Generate Rack ID
    const rackId = `${warehouse.warehouseCode}S${allocatedRack.shelf.shelfNumber}R${allocatedRack.rack.rackNumber}`;

    return rackId;

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};