// scripts/seed.js

import mongoose from "mongoose";
import Warehouse from "../models/Warehouse.js";
import Shelf from "../models/Shelf.js";
import Rack from "../models/Rack.js";
import dotenv from "dotenv";
dotenv.config();
import dns from "node:dns/promises";

dns.setServers(["1.1.1.1", "8.8.8.8"]); 


async function seed() {

  await mongoose.connect("mongodb+srv://vaibhavchelsea8_db_user:Qwerty12345@sns-cluster.rbhiyan.mongodb.net/?appName=SnS-Cluster");

  const warehouse = await Warehouse.create({ warehouseCode: "W1", country: "USA", state: "CA" });
  const shelf = await Shelf.create({ warehouse: warehouse._id, shelfNumber: 1, isLocked: false });

  for (let i = 1; i <= 12; i++) {
    await Rack.create({
      warehouse: warehouse._id,
      shelf: shelf._id,
      rackNumber: i,
      isLocked: false,
      allocatedTo: null
    });
  }

  console.log("Seed completed");
  process.exit(0);
}

seed();