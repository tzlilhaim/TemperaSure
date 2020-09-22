class TempManager {
  constructor() {
    this.cityData = { cities: [], currLocation: {} }
  }
  getCityIndex(cityName) {
    const index = this.cityData.cities.findIndex(
      (c) => c["name"].toLowerCase() === cityName.toLowerCase()
    )
    return index
  }
  async getCityDataFromApi(cityName, lat, lon) {
    const city = await $.ajax({
      method: "get",
      url: `/city/${cityName}/${lat}/${lon}`,
    })
    return city
  }
  async getDataFromDB() {
    const data = await $.get("/cities")
    if (data.length) {
      data.forEach((c) => {
        c["isSaved"] = true
        let index = this.getCityIndex(c.name)
        index === -1
          ? this.cityData.cities.push(c)
          : this.cityData.cities.splice(index, 1, c)
      })
    }
    return this.cityData
  }
  async getCityFromSearch(cityName) {
    const city = await this.getCityDataFromApi(cityName)
    const index = this.getCityIndex(cityName)
    index === -1
      ? this.cityData.cities.push(city)
      : this.cityData.cities.splice(index, 1, city)
    return this.cityData
  }

  async getCurrGeoLocationCity(lat, lon) {
    const city = await this.getCityDataFromApi(null, lat, lon)
    this.cityData.currLocation = city
    return this.cityData
  }

  async saveCity(cityName) {
    const index = this.getCityIndex(cityName)
    this.cityData.cities[index]["isSaved"] = true
    await $.ajax({
      method: "post",
      url: `/city`,
      data: this.cityData.cities[index],
    })
  }
  removeCity(cityName) {
    $.ajax({ method: "delete", url: `/city/${cityName}` })
    const index = this.getCityIndex(cityName)
    this.cityData.cities.splice(index, 1)
    return this.cityData
  }

  async updateCity(cityName) {
    const updatedCity = await $.ajax({
      method: "put",
      url: `/city/${cityName}`,
    })
    const index = this.getCityIndex(cityName)
    updatedCity["isSaved"] = true
    this.cityData.cities.splice(index, 1, updatedCity)
    return this.cityData
  }
}
