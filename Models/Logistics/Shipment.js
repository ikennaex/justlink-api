const mongoose = require("mongoose");

const ShipmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    //   required: true,
    },

    // Sender information
    sender: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String },
      address: { type: String, required: true },
    },

    // Receiver information
    receiver: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String },
      address: { type: String, required: true },
    },

    // Package information
    package: {
      type: { type: String, required: true },
      weight: { type: Number, required: true },
      description: { type: String },
      value: { type: Number },
    },

    // Pickup details
    pickup: {
      pickupType: {
        type: String,
        enum: ["dropoff", "pickup"],
        default: "dropoff",
      },
      pickupDate: { type: Date },
      pickupAddress: { type: String },
    },

    // Shipment pricing
    // pricing: {
    //   baseFee: { type: Number, required: true },
    //   distanceFee: { type: Number, required: true },
    //   weightFee: { type: Number, required: true },
    //   total: { type: Number, required: true },
    // },

    // Tracking details
    trackingNumber: {
      type: String,
      unique: true,
    },

    // Shipment status flow
    status: {
      type: String,
      enum: [
        "pending",
        "picked_up",
        "in_transit",
        "at_warehouse",
        "out_for_delivery",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },

    timeline: [
      {
        message: { type: String },
        location: { type: String },
        date: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const ShipmentModel = mongoose.model("Shipment", ShipmentSchema)

module.exports = ShipmentModel;
