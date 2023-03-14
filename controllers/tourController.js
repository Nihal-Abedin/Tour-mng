const fs = require("fs");

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, "utf-8")
);

exports.getAllTour = (req, res) => {
  res.status(200).json({
    message: "Success",
    data: {
      tours,
    },
  });
};
exports.getTour = (req, res) => {
  const { id } = req.params;
  const tour = tours.find((el) => el.id === +id);
  console.log(tour);
  if (!tour) {
    return res.status(404).json({
      status: 404,
      message: "No Tour With This Id!",
    });
  }
  res.status(200).json({
    message: "Success",
    data: {
      tour,
    },
  });
};
exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;

  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        message: "Succesfully Created!",
        data: {
          tour: newTour,
        },
      });
    }
  );
};
exports.updateTour = (req, res) => {
  const { id } = req.params;
  if (+id > tours.length) {
    return res.status(404).json({
      status: 404,
      message: "No Tour With This Id!",
    });
  }
  res.status(201).json({
    message: "Succesfully Created!",
    data: {
      tour: "<Updated Tour>",
    },
  });
};

exports.deleteTour = (req, res) => {
  const { id } = req.params;
  if (+id > tours.length) {
    return res.status(404).json({
      status: 404,
      message: "No Tour With This Id!",
    });
  }
  res.status(204).json({
    message: "Succesfully Created!",
    data: null,
  });
};
