class LocalStorageManager {
  constructor() {
    this.selectedTempUnit = localStorage.getItem("temperature-unit")
  }
  getTemperatureUnit() {
    return this.selectedTempUnit || "celsius"
  }
  setTemperatureUnit(unit) {
    localStorage.removeItem("temperature-unit")
    localStorage.setItem("temperature-unit", unit)
  }
}