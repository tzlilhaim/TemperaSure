const express = require("express")
const app = express()
const path = require("path")
const { port } = require("./config")
const api = require("./server/routes/api")
const bodyParser = require("body-parser")

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, "dist")))
app.use("/scripts", express.static(__dirname + "/node_modules"))
app.use("/assets", express.static(__dirname + "/assets/weather-conditions"))
app.use("/", api)

app.listen(port, function () {
  console.log(`running server on port ${port}`)
})