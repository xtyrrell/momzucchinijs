// A mom please get me so me zucchini from sho p implmentation in fairly modern JavaScript

import xr from 'xregexp'

import operators from './operators'
import utils from './utils'

/*
* Return the top element of the array
*/
Array.prototype.top = function top () {
  return this[this.length - 1]
}

function recursiveBlock (start, openingDelimiter='{', closingDelimiter='}') {
  return {
    start,
    openingDelimiter,
    closingDelimiter,
    recursive: true
  }
}

function logNegative (str) {
  console.log(`\u001B[7m${str}\u001B[0m`)
}

function logBlue (str) {
  console.log(`\u001B[34m${str}\u001B[0m`)
}

function logRed (str) {
  console.log(`\u001B[31m${str}\u001B[0m`)
}

const patternInstructionPairs = new Map([
  // How these pattern->instruction pairs work is:
  // 1. Write a RegEx to capture an instruction
  // 2.If the instruction takes arguments, each should be in a respective
  // RegEx capture groups.
  // 3. When the interpreter evaluates the code and finds a match for an
  // instruction, it executes the instruction RegEx's function, passing
  // the function the intepreter's current state as the first
  // argument. If there were any capture groups in the matched RegEx, the
  // captured result for each respectively is passed to the function as
  // an argument.

  // For example:
  // RegEx: /print (\w+)/i
  // function: (state, toPrint) => console.log(toPrint)
  // When a match for the RegEx is found in the source code, like:
  // `print helloworld` then  the function is called like so: function(state,
  // 'helloworld')

  [/^(?:push|pus) ((?:\d*\.\d*)|\w+)/i, (state, toPush) => {
    state.stack.push(isFinite(toPush) ? parseFloat(toPush) : toPush)
  }],
  [/^add/i, (state) => {
    state.stack.push(operators.add(state.stack.pop(), state.stack.pop()))
  }],
  [/^(?:subtract|sub)/i, (state) => {
    state.stack.push(operators.subtract(state.stack.pop(), state.stack.pop()))
  }],
  [/^(?:multiply|mul|×|⋅)/i, (state) => {
    state.stack.push(operators.multiply(state.stack.pop(), state.stack.pop()))
  }],
  [/^(?:divide|div|÷)/i, (state) => {
    state.stack.push(operators.divide(state.stack.pop(), state.stack.pop()))
  }],
  [/^(?:negate|neg)/i, (state) => {
    state.stack.push(operators.negate(state.stack.pop()))
  }],
  [/^pop/i, (state) => {
    // TODO: decide what to output when there is nothing to output
    logNegative(state.stack.top() == null ? 0 : state.stack.pop())
  }],
  [/^top/i, (state) => {
    // TODO: decide what to output when there is nothing to output
    logNegative(state.stack.top() == null ? 0 : state.stack.top())
  }],
  [/^(?:peek|pek) \[(\d+)\]/i, (state, index) => {
    // TODO: decide what to output when there is nothing to output
    logNegative(state.stack[index])
  }],
  [/^(?:peekTop|top)/i, (state) => {
    // TODO: decide what to output when there is nothing to output
    logNegative(state.stack.top())
  }],
  [/^(?:length|len)/i, (state) => {
    state.stack.push(state.stack.length)
  }],
  [/^(?:duplicate|dup)/i, (state) => {
    state.stack.push(state.stack.top())
  }],
  [/^(?:double|dbl)/i, (state) => {
    state.stack.push(operators.double(state.stack.pop()))
  }],
  [/^(?:increment|inc)/i, (state) => {
    state.stack.push(operators.increment(state.stack.pop()))
  }],
  [/^(?:decrement|dec)/i, (state) => {
    state.stack.push(operators.decrement(state.stack.pop()))
  }],
  [/^(?:copyAndMove|cpy) \[(\d+)\]->\[(\d+)\]/i, (state, indexFrom, indexTo) => {
    state.stack[indexTo] = state.stack[indexFrom]
  }],
  [/^(?:delete|del) \[(\d+)\]/i, (state, index) => {
    state.stack.splice(index, 1)
  }],
  [/^(?:delete|del)/i, (state) => {
    state.stack.splice(state.stack.length - 1, 1)
  }],
  // [/^fun <(\w+)> ?() {([^}]*)}/i, (state, funName, args, body) => {
  //   console.log('REGISTERING fun with args: ' + args + ' body: ' + body)
  //   state.stack.push(createFun(funName, args, body))
  // }],
  [/^(?:invoke|inv) (\w+)/i, (state, archetypeName) => {
    evaluate(state.archetypes[archetypeName], state)
  }],
  [/^(?:exit|(?:good)?bye)/i, (state) => {
    process.exit(0)
  }],
])

const recursivePatternInstructionPairs = new Map([
  // An archetype is a repeatable block of mom please get me so me zucchini from sho p code.
  // Parameter must be a valid JavaScript key.
  // Archetypes share global state, so an element pushed before an archetype is invoked can
  // be popped during execution of the archetype.
  [recursiveBlock(/^(?:while|whi) {/i), (state, codeBlock) => {
    while (state.stack.top()) {
      evaluate(codeBlock, state)
    }
  }],
  [recursiveBlock(/^(?:if|ift) {/i), (state, codeBlock) => {
      if (state.stack.top()) evaluate(codeBlock, state)
    }
  ],
  [recursiveBlock(/^(?:ifNot|iff) {/i), (state, codeBlock) => {
    if (!state.stack.top()) {
      evaluate(codeBlock, state)
    }
  }],
  [recursiveBlock(/^(?:twice|twi) {/i), (state, codeBlock) => {
      evaluate(codeBlock, state)
      evaluate(codeBlock, state)
    }
  ],
  [recursiveBlock(/^(?:archetype|arc) <(\w+)> {/i), (state, archetypeName, codeBlock) => {
    console.log('REGISTERING ARCHETYPE with body: ' + codeBlock)
    state.archetypes[archetypeName] = codeBlock
  }],
  [recursiveBlock(/^{/i), (state, codeBlock) => {
    // Code blocks should simply be evaluated
      evaluate(codeBlock, state)
    }
  ],
  [recursiveBlock(/^(?:hold on|ign) <~/i, '<~', '~>'), (state, codeBlock) => {
      /* Do nothing for comments */
      // TODO: Remove this
      logBlue(codeBlock)
    }
  ],
])

function parseModes (source) {
  const borges = /ok im .* ?Borges now/gi.test(source)
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
    // TODO: Ensure parseModes() adds any new modes encountered to state every time
    // evaluate() is called
    modes: parseModes(body)
}) {

  state.modes = utils.bestOfBoth(state.modes, parseModes(body))

  // TODO: Make sure nothing breaks if the source code has characters from
  // the astral planes
  for (let i = 0; i < body.length; i++) {
    // logRed(`At i=${i}, char=${body.charAt(i)}`)

    for (const pair of patternInstructionPairs) {
      // If it is a regex:
      const match = pair[0].exec(body.slice(i))
      // If it isn't a regex because it needs more advanced bracket matching, run
      // the more advanced bracket matching

      if (match) {
        const args = match.slice(1)

        logBlue('Executing instruction: "' + match[0] + '" with args: ' + args)
        
        // Execute the instruction with the arguments found by the regex match capture groups.
        // Every capture group's result is passed as an argument.
        pair[1](state, ...args)

        logRed(`Stack is now: ${state.stack}`)

        // Then skip to the end of this instruction
        i += match[0].length - 1

        break
      }
    }

    for (const pair of recursivePatternInstructionPairs) {
      const isRecursive = pair[0].recursive != null
      const match = pair[0].start.exec(body.slice(i))

      if (match) {
        // args gets (any) capture groups first, then codeblock after the capture groups
        const args = match.slice(1) 
        args.push(xr.matchRecursive(body.slice(i), pair[0].openingDelimiter, pair[0].closingDelimiter)[0])

        logBlue('Executing instruction with recursive pattern: "' + match[0]
          + '" with args: ' + args)

        pair[1](state, ...args)

        //   if {              push 5 blah blah   }
        i += match[0].length + args.top().length + pair[0].closingDelimiter.length
        console.log(`skipped to ${i} whatnot`)
      }
    }
  }

  return state
}

const countDownFromFive = `
『good night』=> 

archetype <countDownFromFive> {
  archetype <a> {
    DUPLICATE PUSH 10 subtract iftruthful {push 0} DELETE
    DUPLICATE POP INCREMENT
  }
  push 1
  invokeWHILETRUTHFUL a
  DUPLICATE POP DECREMENT
}

push 5
invokeWhileTruthful countDownFromFive

push stop pop
`

const top = ` implementation of top =>

archetype <top> {
  LENGTH PEEK
}

`

const xreg = xr('^IF {}')
xreg.source

const simple = `
IFNOT {push husband from chile pop}
`

// evaluate(simple)

export default evaluate
