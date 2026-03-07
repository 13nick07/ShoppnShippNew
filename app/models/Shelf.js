import mongoose from "mongoose";

const shelfSchema = new mongoose.Schema({
  warehouse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Warehouse",
    required: true
  },

  shelfNumber: {
    type: Number,
    required: true
  },

  isLocked: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

/* ✅ Prevent duplicate shelf numbers in same warehouse */
shelfSchema.index(
  { warehouse: 1, shelfNumber: 1 },
  { unique: true }
);

export default mongoose.models.Shelf ||
mongoose.model("Shelf", shelfSchema);