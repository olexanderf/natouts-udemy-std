const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
);

exports.checkID = (req, res, next, val) => {
  if (+val > tours.length) {
    return res.status(404).json({
      status: 'fail',
      data: {
        message: 'Invalid ID',
      },
    });
  }
  next();
};

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(404).json({
      status: 'fail',
      data: {
        message: 'Invalid name or price',
      },
    });
  }
  next();
};

exports.getAllTours = (req, res) => {
  console.log(req.requstTime);
  res.status(200).json({
    status: 'succes',
    requestedAt: req.requstTime,
    results: tours.length,
    data: { tours },
  });
};

exports.getTour = (req, res) => {
  console.log(req.params);

  const tour = tours.find((el) => el.id === +req.params.id);

  res.status(200).json({
    status: 'succes',
    data: { tour },
  });
};

exports.createTour = (req, res) => {
  // console.log(req.body);

  const newId = tours[tours.length - 1].id + 1;
  const newTour = { id: newId, ...req.body };

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        message: 'succes',
        data: {
          tour: newTour,
        },
      });
      console.log(err);
    },
  );
};

exports.updateTour = (req, res) => {
  res.status(200).json({
    message: 'succes',
    data: {
      tour: '<Updated tour here>',
    },
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    message: 'succes',
    data: null,
  });
};
