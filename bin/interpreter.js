#!/usr/bin/env node

const readline = require('readline')

const cancelScript = require('../lib/cancelscript')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

rl.on('line', line => {
  cancelScript(line)
  rl.close()
})
