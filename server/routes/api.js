const express = require("express")
const router = express.Router()
const dataManager = require("./DataManager")

router.get("/health", function (req, res) {
  res.send("healthy")
})

router.get("/city/:cityName?/:lat?/:lon?", async function (req, res) {
  const {cityName,lat,lon} = req.params
  const data = await dataManager.getCityWeather({cityName,lat,lon})
  res.send(data)
})

router.get("/cities", async function (req,res){
    const data = await dataManager.getCitiesFromDB()
    res.send(data)
})

router.post("/city",function(req,res){
    const {name,temperature,condition,conditionPic,conditionType,humidity,feelsLike} = req.body
    dataManager.saveCityToDB({name,temperature,condition,conditionPic,conditionType,feelsLike,humidity})
})

router.delete("/city/:cityName",function(req,res){
    const cityName = req.params.cityName
    dataManager.deleteCityFromDB(cityName)
})

router.put("/city/:cityName", async function (req, res) {
  const cityName = req.params.cityName
  const data = await dataManager.updateCityWeather(cityName)
  res.send(data)
})

module.exports = router
