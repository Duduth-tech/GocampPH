const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelper");

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/yelpDatabase")
  .then(() => {
    console.log("MONGO CONNECTION OPEN!!");
  })
  .catch((err) => {
    console.log("OH NO!! MONGO CONNECTION ERROR!");
    console.log(err);
  });

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDb = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000) + 1;
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: "6863de49a9f6eb8f24f56774", // YOUR USER ID HERE
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
        image: [
          {
            url: "https://res.cloudinary.com/dunmnflg8/image/upload/v1752336841/YelpCamp/m89lhvgcjcxkfkib096p.jpg",
            filename: "YelpCamp/m89lhvgcjcxkfkib096p",
          },
        ],
        description:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Error, quia voluptatibus perferendis architecto alias maiores molestiae voluptatum aspernatur laborum praesentium. Ab voluptatibus voluptate dolorum rem eum fugiat, quam tempore impedit.",
        price,
      },
    });
    await camp.save();
  }
};

seedDb().then(() => {
  mongoose.connection.close();
});
