const tempManager = new TempManager()
const lsManager = new LocalStorageManager()
const renderer = new Renderer()
const loader = new Loader()

// Utils
const loadPage = async function () {
  const unit = lsManager.getTemperatureUnit()
  $("#content").attr("data-temperature-unit", unit)
  loadCurrentLocation()
}
const loadSearchLocations = async function () {
  loader.show()
  const savedCities = await tempManager.getDataFromDB()
  await renderer.renderData(savedCities)
  loader.hide()
  minimizeCityBox()
  scrollPageToTop()
}

const loadCurrentLocation = function () {
  navigator.geolocation.getCurrentPosition(async function (geolocation, err) {
    if (err) {
      console.log(err)
    }
    const lat = geolocation.coords.latitude
    const lon = geolocation.coords.longitude
    loader.show()
    const cityData = await tempManager.getCurrGeoLocationCity(lat, lon)
    await renderer.renderData(cityData)
    loader.hide()
    expandCityBox()
    scrollPageToTop()
  })
}

const scrollPageToTop = function () {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  })
}

const scrollPageToCity = function (cityName) {
  const $city = $(`.city[data-name='${cityName}']`)
  const offset = $city.offset()
  try {
    window.scrollTo({
      top: offset.top,
      left: offset.left,
      behavior: "smooth",
    })
  } catch (err) {
    console.log(err)
  }
}

const handleSearch = async function (cityName) {
  await toggleLocationTab("searched-locations")
  const cityData = await tempManager.getCityFromSearch(cityName)
  renderer.renderData(cityData)
  expandCityBox(cityName)
  scrollPageToCity(cityName)
}

const saveCity = async function ($city) {
  const cityName = $city.attr("data-name")
  await tempManager.saveCity(cityName)
}

const removeCity = function ($city) {
  const cityName = $city.attr("data-name")
  const updatedCityData = tempManager.removeCity(cityName)
  renderer.renderData(updatedCityData)
}

const minimizeCityBox = function (cityName = 0) {
  let $cityWeather
  let $arrowBtn
  if (cityName) {
    cityName = cityName.charAt(0).toUpperCase() + cityName.slice(1)
    $cityWeather = $(`.city[data-name='${cityName}']`).find(".weather-info")
    $arrowBtn = $(`.city[data-name='${cityName}']`).find(".arrow-btn")
  } else {
    $cityWeather = $(".weather-info")
    $arrowBtn = $(".arrow-btn")
  }
  try {
    $cityWeather.addClass("hidden")
  } catch (err) {
    console.log(err)
  }
  $arrowBtn.attr("class", "arrow-btn fas fa-chevron-right")
}

const expandCityBox = function (cityName = 0) {
  let $cityWeather
  let $arrowBtn
  if (cityName) {
    cityName = cityName.charAt(0).toUpperCase() + cityName.slice(1)
    $cityWeather = $(`.city[data-name='${cityName}']`).find(".weather-info")
    $arrowBtn = $(`.city[data-name='${cityName}']`).find(".arrow-btn")
  } else {
    $cityWeather = $(".weather-info")
    $arrowBtn = $(".arrow-btn")
  }
  try {
    $cityWeather.removeClass("hidden")
  } catch (err) {
    console.log(err)
  }
  $arrowBtn.attr("class", "arrow-btn fas fa-chevron-down")
}

const updateCity = async function (cityName) {
  const cityData = await tempManager.updateCity(cityName)
  await renderer.renderData(cityData)
  minimizeCityBox()
  expandCityBox(cityName)
  scrollPageToCity(cityName)
}

const toggleTemperatureUnit = (unit) => {
  const $pageContent = $("#content")
  $pageContent.attr("data-temperature-unit", unit)
}

const toggleLocationTab = (location) => {
  const tabToDisplay = location
    ? location
    : $("#location-btn > span.selected").attr("data-toggle")
  const $currLocationTab = $("#current-location-container")
  const $searchedLocationsTab = $("#cities-container")
  if (tabToDisplay === "current-location") {
    $("#location-btn > span.selected").attr("data-toggle")
    if ($currLocationTab.hasClass("hidden")) {
      $currLocationTab.removeClass("hidden")
      $searchedLocationsTab.addClass("hidden")
      loadCurrentLocation()
    }
  } else {
    if ($searchedLocationsTab.hasClass("hidden")) {
      $searchedLocationsTab.removeClass("hidden")
      $currLocationTab.addClass("hidden")
      loadSearchLocations()
    }
  }
}

const alertInput = ($input) => {
  $input.addClass("alerted")
  setTimeout(function () {
    $input.removeClass("alerted")
  }, 3000)
}

// Listeners & Invokations
loadPage()

$("#search-btn").on("click", function () {
  const $input = $("#nav-bar>input[name='city-name']")
  if ($input.val()) {
    let cityName = $input.val().toLowerCase()
    cityName = cityName.charAt(0).toUpperCase() + cityName.slice(1)
    handleSearch(cityName)
    $input.val(null)
  } else {
    alertInput($input)
  }
})

$(".toggle-btn").on("click", function () {
  const $currOption = $(this).find("span.selected")
  const $newOption = $(this).find("span:not(.selected)")
  $currOption.removeClass("selected")
  $newOption.addClass("selected")
  if ($(this).attr("id") === "temp-unit-btn") {
    expandCityBox()
    toggleTemperatureUnit($newOption.attr("data-toggle"))
  } else {
    toggleLocationTab($newOption.attr("data-toggle"))
  }
})

$("#content").on("click", ".city i.action-btn", function () {
  const $city = $(this).closest(".city")
  if ($city.hasClass("saved")) {
    removeCity($city)
  } else {
    saveCity($city)
    $city.addClass("saved")
    $(this).attr("class", "fas fa-minus-circle action-btn")
  }
})

$("#content").on("click", ".city i.refresh-btn", function () {
  const cityName = $(this).closest(".city").attr("data-name")
  updateCity(cityName)
})

$("#content").on("click", ".city button.collapsible", function () {
  const cityName = $(this).closest(".city").attr("data-name")
  const $weatherInfo = $(`.city[data-name='${cityName}']`).find(".weather-info")
  if ($weatherInfo.hasClass("hidden")) {
    expandCityBox(cityName)
  } else {
    minimizeCityBox(cityName)
  }
})

$(window).scroll(function () {
  const scroll = $(window).scrollTop()
  const $toTopBtn = $("#to-top-btn")

  if (scroll > 20) {
    $toTopBtn.removeClass("hidden")
  } else {
    $toTopBtn.addClass("hidden")
  }
})

$("#to-top-btn").on("click", function () {
  scrollPageToTop()
})
