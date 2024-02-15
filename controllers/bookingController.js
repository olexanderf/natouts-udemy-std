const crypto = require('crypto');
const { default: axios } = require('axios');
const catchAsync = require('../utils/catchAsync');
const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const factory = require('./handlerFactory');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get currently booked tour
  const tour = await Tour.findById(req.params.tourId);
  // 2) Create checkout session
  const signatureObj = {
    merchantAccount: process.env.MERCHANT_LOGIN,
    merchantDomainName: 'https://www.natours.dev',
    orderReference: `${req.params.tourId}`,
    orderDate: Date.now(),
    amount: tour.price,
    currency: 'UAH',
    productName: [`${tour.name} Tour`],
    productCount: [1],
    productPrice: [tour.price]
  };
  const signatureString = `${Object.values(signatureObj)}`
    .replaceAll(/\[|\]/g, '')
    .replaceAll(',', ';');

  const hash = crypto
    .createHmac('md5', process.env.MERCHANT_SECRET_KEY)
    .update(signatureString)
    .digest('hex');

  const checkoutObj = {
    ...signatureObj,
    transactionType: 'CREATE_INVOICE',
    merchantAuthType: 'SimpleSignature',
    apiVersion: 1,
    orderTimeout: 49000,
    merchantSignature: hash,
    returnUrl: `${req.protocol}://${req.get('host')}/`,
    clientEmail: req.user.email,
    serviceUrl: `${req.protocol}://${req.get('host')}/`
  };

  const session = await axios({
    method: 'POST',
    url: 'https://api.wayforpay.com/api',
    data: {
      ...checkoutObj
    }
  });

  // 3) Create session as responst

  res.status(200).json({
    status: 'success',
    data: session.data
  });
});

exports.createBooking = factory.createOne(Booking);
exports.getOneBooking = factory.getOne(Booking);
exports.getAllBooking = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
