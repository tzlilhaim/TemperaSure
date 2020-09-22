const mongoose = require( 'mongoose' )
const Schema = mongoose.Schema


const citySchema = new Schema( {
    name:String,
    temperature:Object,
    condition:String,
    conditionType:String,
    conditionPic:String,
    feelsLike:Object,
    humidity: Number,
    updatedAt: Date
  })

const City = mongoose.model( 'City', citySchema )

module.exports = City