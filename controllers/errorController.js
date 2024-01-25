const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};
const handleDuplicateFieldsDB = (err) => {
  const value = Object.values(err.keyValue).join(', ');
  const message = `Duplicate field value: ${value} . Please youse another value.`;
  return new AppError(message, 400);
};
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data: ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      err: err,
      message: err.message,
      stack: err.stack
    });
  }
  console.error('ERROR!!', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something want wrong',
    msg: err.message
  });
};

const sendErrorProd = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperation) {
      // API
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    }
    // Rendered website
    console.error('ERROR!!', err);

    return res.status(500).json({
      status: 'error',
      message: 'Something went wary wrong!'
    });
  }
  if (err.isOperation) {
    // API
    return res.status(err.statusCode).render('error', {
      title: 'Something want wrong',
      msg: err.message
    });
  }
  // Rendered website
  console.error('ERROR!!', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something want wrong',
    msg: 'Please try again later'
  });
};

const handleJWTError = () =>
  new AppError('Invalid token. Please login again', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please login again', 401);

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  console.log(err);

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    // let error = { ...err };
    let error = Object.assign(err);
    // console.log(error);
    // error.message = err.message;

    if (err.name === 'CastError') error = handleCastErrorDB(error);
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();
    if (err.code === 11000) error = handleDuplicateFieldsDB(error);
    if (err._message === 'Validation failed') {
      error = handleValidationErrorDB(error);
    }
    sendErrorProd(error, req, res);
  }
};
