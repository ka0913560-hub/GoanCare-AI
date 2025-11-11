const mongoose = require("mongoose")
const Schema = mongoose.Schema
const bookingSchema = new Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true
  },
  bookingTime: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected", "completed", "cancelled"],
    default: "pending"
  },
  price: {
    type: Number,
    // required: true
  },
  location: {
    lat: Number,
    lng: Number
  },
  emergency: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model("Booking", bookingSchema)