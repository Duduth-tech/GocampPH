const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

//set up an instance of CloudinaryStorage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "YelpCamp", // The folder in your Cloudinary account where images will be stored
    allowedFormats: ["jpeg", "png", "jpg"], // Allowed image formats
  },
});

module.exports = {
  cloudinary,
  storage,
};
