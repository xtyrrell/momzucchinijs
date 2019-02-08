// A mom please get me so me zucchini from sho p implmentation in fairly modern JavaScript

import xr from 'xregexp'

import operators from './operators'
import utils from './utils'
import logging from './output'
import patternInstructionPairs from './instructions'

function parseModes (source) {
  // borges: 
  const borges = /ok i.?m .* ?Borges now/gi.test(source)
  const paradise = /welcome (2|to) paradi(s|c)e/gi.test(source)
  const chile = /husband from Chile/gi.test(source)
  const tarot = /Tarot de Marseille/gi.test(source)
  const goodNight = /good night/gi.test(source)
  const todont = /todon'?t/gi.test(source)
  const moody = /心情不稳的/gi.test(source)

  return {
    borges,
    paradise,
    chile,
    tarot,
    goodNight,
    todont,
    moody
  }
}

function evaluate (body, state={
    stack: [],
    archetypes: {},
    modes: {},
    interactive: false // This will be turned on if we are interpreting
                       // in a line-by-line, interactive way
}) {

  // Ensure any new modes encountered are added to `state` every time
  // evaluate() is called
  state.modes = utils.bestOfBoth(state.modes, parseModes(body))

  // Return the top element of the stack
  state.stack.top = function top () {
    return this[this.length - 1]
  }

  // TODO: Make sure nothing breaks if the source code has multibyte characters
  for (let i = 0; i < body.length; i++) {
    // logging.logRed(`At i=${i}, char=${body.charAt(i)}`)

    for (const pair of patternInstructionPairs) {
      const isRecursive = pair[0].recursive

      const pattern = isRecursive ? pair[0].start : pair[0]
      const match = pattern.exec(body.slice(i))

      if (match) {
        const args = match.slice(1)

        // `args` gets (any) capture groups first, then codeblock after the capture groups.
        // Define `codeBlock` in this scope so it can be accessed later out of
        // the following if.
        let codeBlock
        if (isRecursive) {
          codeBlock = xr.matchRecursive(body.slice(i), pair[0].openingDelimiter, pair[0].closingDelimiter)[0]
          args.push(codeBlock)
        }

        logging.logBlue(`Executing ${isRecursive ? 'recursive ' : ''}instruction: "${match[0]}" with args: ${args}`)
        
        // Execute the instruction with the arguments found by the regex match capture groups.
        // Every capture group's result is passed as an argument.
        pair[1](state, ...args)

        logging.logRed(`Stack is now: ${state.stack}`)

        // Then skip to the end of this instruction
        if (isRecursive) {
          //   while {           push 5 blah blah    }
          i += match[0].length + codeBlock.length + pair[0].closingDelimiter.length
        } else {
          i += match[0].length
        }

        break
      }
    }
  }

  return state
}

export default evaluate
