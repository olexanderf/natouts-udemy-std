const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRouter');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

//1) GLOBAL MIDDLEWARES
app.use(helmet());

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL injection
app.use(mongoSanitize());
// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);

app.use(express.static(`${__dirname}/public`));

const limiter = rateLimit({
  limit: 100,
  windowMS: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in hour!'
});

app.use('/api', limiter);
app.use((req, res, next) => {
  req.requstTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

//3) ROUTES

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  // if in next have parameters express now that is an error
  // skip all other middleware in stack and go to error middleware
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

//4) START SERVER

module.exports = app;
