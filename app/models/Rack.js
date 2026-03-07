import mongoose from "mongoose";

const rackSchema = new mongoose.Schema({

  warehouse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Warehouse",
    required: true
  },

  shelf: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shelf",
    required: true
  },

  rackNumber: {
    type: Number,
    required: true  // 1 to 12
  },

  isLocked: {
    type: Boolean,
    default: false
  },

  allocatedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },

  allocatedAt: {
    type: Date,
    default: null
  }

}, { timestamps: true });

/* ✅ Prevent duplicate rack in same shelf */
rackSchema.index(
  { shelf: 1, rackNumber: 1 },
  { unique: true }
);

/* ✅ Fast lookup for available racks */
rackSchema.index(
  { warehouse: 1, isLocked: 1, allocatedTo: 1 }
);

export default mongoose.models.Rack ||
mongoose.model("Rack", rackSchema);