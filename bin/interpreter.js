import readline from 'readline'

import evaluate from '../lib/evaluate.js'

export default function setupInteractiveCli () {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '-> hey mom '
  })

  console.log(
    'hello welcom e to mom please get zucchine thax. please start  program ok'
  )

  rl.prompt()

  let state

  rl.on('line', line => {
    if (!state) {
      state = evaluate(line)
      state.interactive = true
    } else state = evaluate(line, state)
    rl.prompt()
  })
}
