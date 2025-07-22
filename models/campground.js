const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

// https://res.cloudinary.com/demo/image/upload/c_thumb,g_face,h_200,w_200/r_max/f_auto/woman-blackdress-stairs.png

const ImageSchema = new Schema({
  url: String,
  filename: String,
});
ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200,h_200,c_thumb"); // This will create a thumbnail version of the image;
});

const opts = { toJSON: { virtuals: true }, toObject: { virtuals: true } };

const CampgroundSchema = new Schema({
  title: String,
  price: Number,
  description: String,
  location: String,
  image: [
    ImageSchema, // This is an array of ImageSchema objects
  ],
  geometry: {
    type: {
      type: String, // 'Point'
      enum: ["Point"], // 'type' must be 'Point'
      required: true,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

CampgroundSchema.virtual("properties.popUpMarkup").get(function () {
  return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
  <p>${this.description.substring(0, 20)}...</p>`;
});

CampgroundSchema.post(
  "findOneAndDelete",
  async (doc) => {
    /* console.log(doc) // check the deleted doc as we still have access to it */
    if (doc) {
      await Review.deleteMany({
        _id: {
          $in: doc.reviews,
        },
      });
    }
  },
  opts
);

const Campground = mongoose.model("Campground", CampgroundSchema);

module.exports = Campground;
