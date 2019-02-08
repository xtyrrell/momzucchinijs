
function log (str) {
  // console.log(`\u001B[7m${str}\u001B[0m`)
  console.log(str)
}

function logBlue (str) {
  console.log(`\u001B[34m${str}\u001B[0m`)
}

function logRed (str) {
  console.log(`\u001B[31m${str}\u001B[0m`)
}

export default {log, logBlue, logRed}
