class TempConverter {
  getSelectedUnit(){
    return this.selectedUnit || "celsius"
  }
  setTempUnit(unit){
    localStorage.setItem("temperature-unit",unit)
  }
  getBothTemperatures(celsius) {
    const farenheit = this.celsiusToFarenheit(celsius)
    return { celsius: parseInt(celsius).toFixed(), farenheit: farenheit }
  }
  celsiusToFarenheit(celsius) {
    const fahrenheit = celsius * (9 / 5) + 32
    return fahrenheit.toFixed()
  }
}

const tempConverter = new TempConverter()
module.exports = tempConverter