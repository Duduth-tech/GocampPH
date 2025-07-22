const Campground = require("../models/campground");
const { cloudinary } = require("../cloudinary");
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index.ejs", { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new.ejs");
};
module.exports.createCampground = async (req, res, next) => {
  /* just a sample of error handling if (!req.body.campground) throw new ExpressError("Invalid Campground", 400); */
  const geoData = await maptilerClient.geocoding.forward(
    req.body.campground.location,
    { limit: 1 }
  );
  const newCamp = new Campground(req.body.campground);
  newCamp.geometry = geoData.features[0].geometry;

  newCamp.image = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  newCamp.author = req.user.id;
  await newCamp.save();
  // console.log(newCamp);
  req.flash("success", "SUCCESSFULLY CREATED A NEW CAMPGROUND!!");
  res.redirect(`/campgrounds/${newCamp._id}`);
};

module.exports.showCampground = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("author");
  if (!campground) {
    req.flash("error", "Cannot Find that Campground");
    res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", {
    campground,
    mapToken: process.env.MAPBOX_TOKEN,
  });
};

module.exports.renderEditForm = async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  if (!campground) {
    req.flash("error", "Cannot Find that Campground");
    res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit.ejs", { campground });
};

module.exports.updateCampground = async (req, res) => {
  const { id } = req.params;
  // console.log(req.body);
  const campground = await Campground.findByIdAndUpdate(
    id,
    { ...req.body.campground },
    { new: true }
  );

  const geoData = await maptilerClient.geocoding.forward(
    req.body.campground.location,
    { limit: 1 }
  );

  campground.geometry = geoData.features[0].geometry;
  const imgs = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  campground.image.push(...imgs);
  await campground.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await campground.updateOne({
      $pull: { image: { filename: { $in: req.body.deleteImages } } },
    });
    console.log(campground);
  }
  req.flash("success", "Successfully Updated a campground!");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndDelete(id);
  req.flash("success", "Successfully Deleted a Campground!");
  res.redirect("/campgrounds");
};
