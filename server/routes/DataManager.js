const mongoose = require("../app/mongoose")
const moment = require("moment")
const cities = require("./cities")
const tempConverter = require("./TempConverter")

class DataManager {
  constructor() {
    this.city = require("../models/City")
  }
  async getCityRelevantFields(cityFullData) {
    const { name, main, weather } = cityFullData
    const temperature = tempConverter.getBothTemperatures(main["temp"])
    const feelsLike = tempConverter.getBothTemperatures(main["feels_like"])

    const city = {
      name,
      temperature: temperature,
      feelsLike: feelsLike,
      humidity: main["humidity"].toFixed(),
      condition: weather[0].description,
      conditionPic: `http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`,
      isSaved: false,
      conditionType: weather[0].main,
      updatedAt: await moment().format("YYYY-MM-DD HH:mm:ss"),
    }

    return city
  }
  async getCityWeather(searchParams) {
    const cityWeather = await cities.getWeather(searchParams)
    const city = this.getCityRelevantFields(cityWeather)
    return city
  }

  async getCitiesFromDB() {
    const cities = await this.city.find({}, { _id: 0, __v: 0 })
    return cities
  }
  async saveCityToDB(cityData) {
    try {
      const city = new this.city(cityData)
      await city.save()
    } catch (err) {
      console.log("err" + err)
    }
  }
  async deleteCityFromDB(cityName) {
    await this.city.deleteMany({ name: cityName }).exec(function (err) {
      err !== null ? console.log(err) : null
    })
  }
  async updateCityWeather(cityName) {
    const updateCity = await this.getCityWeather({cityName,lat:null,lon:null})
    await this.deleteCityFromDB(cityName)
    await this.saveCityToDB(updateCity)

    let cityData = await this.city.findOne(
      { name: cityName },
      { _id: 0, __v: 0 }
    )
    return cityData
  }
}

const dataManager = new DataManager()
module.exports = dataManager
