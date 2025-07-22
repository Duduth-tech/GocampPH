const Campground = require("../models/campground");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user.id;
  await review.save(); // Save review first
  campground.reviews.push(review._id); // Push only the ObjectId
  await campground.save();
  req.flash("success", "Added a New Review!");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Review.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);

  req.flash("success", "Successfully Deleted a Review!");
  res.redirect(`/campgrounds/${id}`);
};
