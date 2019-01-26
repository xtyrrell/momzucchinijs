import readline from 'readline'
import path from 'path'
import fs from 'fs'

import evaluate from './lib/evaluate.js'

let interactive = true

for (const arg of process.argv) {
  if (path.extname(arg) === '.zucchinipleasemom') {
    interactive = false
    evaluate(fs.readFileSync(path.normalize(arg)))
  }
}

if (interactive) createInteractiveCLI()

function createInteractiveCLI () {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '-> hey mom '
  })

  rl.write('hello welcom e to mom please get zucchine thax. please start  program ok\n')
  rl.prompt()

  let state

  rl.on('line', line => {
    if (!state) state = evaluate(line)
    else state = evaluate(line, state)
    rl.prompt()
  })
}
