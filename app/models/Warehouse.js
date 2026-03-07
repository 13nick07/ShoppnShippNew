import mongoose from "mongoose";

const warehouseSchema = new mongoose.Schema(
  {
    warehouseCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true, // W1, AE-DXB-01 etc
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    countryCode: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },

    country: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    addressLine: {
      type: String,
      required: true,
      trim: true,
    },

    postalCode: {
      type: String,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

/* ✅ Fast lookup for dropdown filtering */
warehouseSchema.index({ countryCode: 1, city: 1 });

/* ✅ Prevent duplicate warehouse names inside same city */
warehouseSchema.index(
  { countryCode: 1, city: 1, name: 1 },
  { unique: true }
);

export default mongoose.models.Warehouse ||
  mongoose.model("Warehouse", warehouseSchema);