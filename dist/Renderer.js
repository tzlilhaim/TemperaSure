class Renderer {
  constructor() {
    this.data = { cities: [], currLocation: [] }
    this.view = {
      $cityWeatherTemplate: $("#city-weather-template"),
      $citiesContainer: $("#cities-container"),
      $currCityContainer: $("#current-location-container"),
    }
  }
  getTemplateHTML($template, cities) {
    const source = $template.html()
    const template = Handlebars.compile(source)
    const newHTML = template(cities)
    return newHTML
  }
  async renderData(data) {
    this.view.$citiesContainer.empty()
    this.view.$currCityContainer.empty()
    this.data = data
    const allCitiesHTML = this.getTemplateHTML(this.view.$cityWeatherTemplate, {
      cities: this.data.cities,
    })
    const currentCityHTML = this.getTemplateHTML(
      this.view.$cityWeatherTemplate,
      { cities: [this.data.currLocation] }
    )

    this.view.$citiesContainer.append(allCitiesHTML)
    this.view.$currCityContainer.append(currentCityHTML)
  }
}
