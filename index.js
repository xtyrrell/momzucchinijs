// Enable ESM 'import' and 'export' stuff with the `esm` module
require = require("esm")(module)
module.exports = require("./main.js")
