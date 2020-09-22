const dotenv = require("dotenv")
dotenv.config()
module.exports = {
  port: process.env.PORT,
  ApiKey: process.env.API_KEY,
  ApiURI: process.env.API_URI,
  mongoDbURI:process.env.MONGODB_URI
}