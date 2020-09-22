const mongoose = require("mongoose")
const { mongoDbURI } = require("../../config")

mongoose.connect(mongoDbURI, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
})

module.exports = mongoose
