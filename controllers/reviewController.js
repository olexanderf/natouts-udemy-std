const catchAsync = require('../utils/catchAsync');
const Review = require('../models/reviewModel');
const AppError = require('../utils/appError');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();
  res.status(200).json({
    status: 'success',
    result: reviews.length,
    data: {
      reviews
    }
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  const { tour, review, rating } = req.body;

  if (!review) return next(new AppError('You must fill review field', 400));
  if (!tour) return next(new AppError('Please select tour for review', 400));

  const newReview = await Review.create({
    review: review,
    rating: rating,
    tour: tour,
    user: req.user.id
  });

  res.status(201).json({
    status: 'success',
    data: {
      review: newReview
    }
  });
});
