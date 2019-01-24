import readline from 'readline'

import evaluate from './lib/mom-please-get-me-so-me-zucchini-from-sho-p.js'

const rl = readline.createInterface({input: process.stdin, output: process.stdout, prompt: '-> hey mom '})

rl.prompt()

rl.on('line', line => {
  evaluate(line)
  rl.prompt()
})
