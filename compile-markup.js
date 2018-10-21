const { writeFileSync } = require("fs")
const { compileFile } = require("pug")
const templateLocals = require("./pug-variables")
const { publicFolder } = require("./config")

const locals = {
  ...templateLocals,
  isProduction: true
}

const generate = (input, output) => {
  const html = compileFile(`views/${input}.pug`)(locals)
  writeFileSync(output, html)
}

generate("impressum", publicFolder + "/impressum.html")
generate("index", publicFolder + "/index.html")
