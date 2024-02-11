const crypto = require('crypto');
const { default: axios } = require('axios');
const catchAsync = require('../utils/catchAsync');
const Tour = require('../models/tourModel');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get currently booked tour
  const tour = await Tour.findById(req.params.tourId);
  // 2) Create checkout session
  const signatureObj = {
    merchantAccount: process.env.MERCHANT_LOGIN,
    merchantAuthType: 'SimpleSignature',
    merchantDomainName: 'https://remote-demining-kappa.vercel.app',
    orderReference: `OR${Date.now()}`,
    orderDate: Date.now(),
    amount: tour.price,
    currency: 'UAH',
    orderTimeout: '49000',
    productName: [`${tour.name} Tour`],
    productPrice: [tour.price],
    productCount: [1]
  };
  /* console.log({ signatureObj });
  console.log(
    `${Object.values(signatureObj)}`
      .replaceAll(/\[|\]/g, '')
      .replaceAll(',', ';')
  ); */
  const signatureString = `${Object.values(signatureObj)}`
    .replaceAll(/\[|\]/g, '')
    .replaceAll(',', ';');

  const hash = crypto
    .createHmac('md5', process.env.MERCHANT_SECRET_KEY)
    .update(signatureString)
    .digest('hex');

  const checkoutObj = {
    ...signatureObj,
    merchantSignature: hash,
    returnUrl: `${req.protocol}://${req.get('host')}/`
  };
  /*   const session = express().post(
    'https://secure.wayforpay.com/pay',
    (req, res, next) => {
      req.body = checkoutObj;
      next();
    }
  ); */
  const session = await axios.post(
    'https://secure.wayforpay.com/pay',
    checkoutObj
  );
  console.log(session);
  // 3) Create session as responst
  // console.log(checkoutObj);
  res.status(200).json({
    status: 'success'
    // session
  });
});
