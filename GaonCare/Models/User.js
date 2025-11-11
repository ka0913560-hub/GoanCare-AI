const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");



const medicalRecordSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  diagnosis: String,
  treatment: String,
  prescriptions: [String],
  reports: [String],
  notes: String
});

const userSchema = new Schema({
  fullName: {
    type: String,
    // required: true,
    trim: true,
  },

  location: {
    type: String,
  },

  profilePhoto:{
    url:String
  },


  email: {
    type: String,
    unique: true,
    required: true,
  },

  coordinates: { lat: String , lng: String },

  //   username  ye sab passport local mongoose khud implement kar dega
  //   password

  createdAt: {
    type: Date,
    default: Date.now,
  },

  medicalRecords: [medicalRecordSchema] // embedded schema

});


userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

module.exports = User;
  