const mongoose = require("mongoose");

const riderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed

  // Rider status
  isActive: { type: Boolean, default: true }, // if rider account is active
  isAvailable: { type: Boolean, default: true }, // available for new orders

  // Location tracking (optional)
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], default: [0, 0] } // [longitude, latitude]
  },

  // Orders assigned to the rider (array of order IDs)
  assignedOrders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shipment"
    }
  ],

  // Ratings for rider performance
//   ratings: [
//     {
//       userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//       rating: { type: Number, min: 1, max: 5 },
//       review: { type: String },
//       createdAt: { type: Date, default: Date.now }
//     }
//   ],
//   averageRating: { type: Number, default: 0 },
//   ratingCount: { type: Number, default: 0 },

  // Vehicle info (optional)
//   vehicleType: { type: String }, // bike, car, etc.
//   vehicleNumber: { type: String },

}, {timestamps: true});

// Enable geospatial index for location queries
riderSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Rider", riderSchema);