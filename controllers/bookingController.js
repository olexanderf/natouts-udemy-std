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
    merchantDomainName: 'https://www.natours.dev',
    orderReference: `OR${Date.now()}`,
    orderDate: Date.now(),
    amount: tour.price,
    currency: 'UAH',
    productName: [`${tour.name} Tour`],
    productCount: [1],
    productPrice: [tour.price]
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
    transactionType: 'CREATE_INVOICE',
    merchantAuthType: 'SimpleSignature',
    apiVersion: 1,
    orderTimeout: 49000,
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
  const session = await axios({
    method: 'POST',
    url: 'https://api.wayforpay.com/api',
    data: {
      ...checkoutObj
    }
  });
  // console.log(session);
  // 3) Create session as responst
  // console.log(signatureString);
  /*   res.status(200).render('stripe', (err, html) => {
    res.send(session);
  }); */
  res.status(200).json({
    status: 'success',
    data: session.data
    // data: { signatureString, checkoutObj }
  });
});
