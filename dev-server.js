const express = require("express")
const logger = require("morgan")
const templateLocals = require("./pug-variables")
const { publicFolder } = require("./config")

const locals = {
  ...templateLocals,
  isProduction: false
}

const e = express()

e.use(logger("dev"))
e.set("view engine", "pug")
e.set("views", "views")

e.get("/", (req, res) => res.render("index.pug", locals))

e.use(express.static(publicFolder))
e.listen(3001)

module.exports = e
