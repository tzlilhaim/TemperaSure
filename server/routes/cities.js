const axios = require("axios")
const { ApiKey, ApiURI } = require("../../config")

const getWeather = async function (params) {
  let { cityName, lat, lon } = params
  cityName = cityName === "null" ? null : cityName
  let url
  if (cityName) {
    url = `${ApiURI}q=${cityName}&appid=${ApiKey}&units=metric`
  } else {
    url = `${ApiURI}lat=${lat}&lon=${lon}&appid=${ApiKey}&units=metric`
  }

  try {
    const res = await axios({
      method: "get",
      url: url,
    })
    return res.data
  } catch (err) {
    console.log(err)
  }
}

module.exports = { getWeather }
