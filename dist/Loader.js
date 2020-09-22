class Loader {
    constructor() {
      this.$loader = $("#loader-container")
    }
    show() {
      this.$loader.hasClass("hidden") ? this.$loader.removeClass("hidden") : null
    }
    hide() {
      !this.$loader.hasClass("hidden") ? this.$loader.addClass("hidden") : null
    }
  }