const Review = require('../models/reviewModel');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

exports.setTourUserIds = (req, res, next) => {
  if (!req.body.review)
    return next(new AppError('You must fill review field', 400));
  // if (!tour) return next(new AppError('Please select tour for review', 400));
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllReviews = factory.getAll(Review);
exports.getOneReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
