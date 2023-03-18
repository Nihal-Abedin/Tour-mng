class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludeFields = ["page", "limit", "sort", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);

    //  for query operators
    let queryString = JSON.stringify(queryObj);

    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    console.log(JSON.parse(queryString));

    this.query = this.query.find(JSON.parse(queryString));

    return this;
    // let query = Tour.find(JSON.parse(queryString));
  }
  // sorting
  sort() {
    if (this.queryString.sort) {
      // sort('price duration ratingsAverage')
      const sortFields = this.queryString.sort.split(",").join(" ");
      console.log(sortFields);
      this.query = this.query.sort(sortFields);
    }
    return this;
  }
  // limitting
  limitFields() {
    if (this.queryString.fields) {
      // sort('price duration ratingsAverage')
      const limitFields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(limitFields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }
  // pgination
  paginate() {
    const page = +this.queryString.page || 1;

    const limit = +this.queryString.limit || 3;

    const skip = (page - 1) * limit;
    console.log(skip, limit);
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
