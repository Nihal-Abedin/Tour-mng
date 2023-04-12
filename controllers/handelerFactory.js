const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const doc = await Model.findByIdAndDelete(id);
    if (!doc) {
      return next(new AppError("No document with this ID", 404));
    }
    res.status(204).json({
      message: "Success",
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;

    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //   return next(new AppError("No tour with this ID", 404));
    // }
    const doc = await Model.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(new AppError("No Document with this ID", 404));
    }
    res.status(201).json({
      message: "Success",
      data: {
        data: doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    doc.save({ validateBeforeSave: true });
    res.status(201).json({
      message: "Succesfully Created!",
      data: {
        data: doc,
      },
    });
  });
exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    let query = Model.findById(id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;
    if (!doc) {
      return next(new AppError("No document with this ID", 404));
    }
    res.status(200).json({
      message: "Success",
      data: {
        data: doc,
      },
    });
  });
exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // for nested GET reviews on tour
    let filterObj = {};
    if (req.params.tourId) {
      filter = { tour: req.params.tourId };
    }

    const features = new APIFeatures(Model.find(filterObj), req.query)

      .filter()
      .sort()
      .limitFields()
      .paginate();

    // const doc = await features.query.explain();
    const doc = await features.query;

    res.status(200).json({
      message: "Success",
      results: doc.length,
      data: {
        data: doc,
      },
    });
  });
