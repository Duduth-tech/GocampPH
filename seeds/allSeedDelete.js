const mongoose = require("mongoose");
const Campground = require("../models/campground");

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/yelpDatabase")
  .then(() => {
    console.log("MONGO CONNECTION OPEN!!");
    return Campground.deleteMany({});
  })
  .then(() => {
    console.log("All campgrounds deleted!");
    mongoose.connection.close();
  })
  .catch((err) => {
    console.log("OH NO!! MONGO CONNECTION ERROR!");
    console.log(err);
    mongoose.connection.close();
  });
