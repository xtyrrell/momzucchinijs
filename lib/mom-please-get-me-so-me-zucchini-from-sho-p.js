// A mom please get me so me zucchini from sho p implmentation in fairly modern JavaScript

const xr = require('xregexp')

const ops = require('./operators')

/*
* Return the top element of the array
*/
Array.prototype.top = function top () {
  return this[this.length - 1]
}

function bracketMatchingRegex (start, openingDelimiter, closingDelimiter) {
  

}

function logNegative (str) {
  return console.log(`\u001B[7m${str}\u001B[0m`)
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

  [/^push ((?:\d*\.\d*)|\w+)/i, (state, toPush) => {
    state.stack.push(isFinite(toPush) ? parseFloat(toPush) : toPush)
  }],
  [/^(?:add|\+)/i, (state) => {
    state.stack.push(ops.add(state.stack.pop(), state.stack.pop()))
  }],
  [/^(?:subtract|\-)/i, (state) => {
    state.stack.push(ops.subtract(state.stack.pop(), state.stack.pop()))
  }],
  [/^(?:multiply|x|\*|×|⋅)/i, (state) => {
    state.stack.push(ops.multiply(state.stack.pop(), state.stack.pop()))
  }],
  [/^(?:divide|\/|÷)/i, (state) => {
    state.stack.push(ops.divide(state.stack.pop(), state.stack.pop()))
  }],
  [/^pop/i, (state) => {
    // TODO: decide what to output when there is nothing to output
    logNegative(state.stack.top() == null ? 0 : state.stack.pop())
  }],
  [/^top/i, (state) => {
    // TODO: decide what to output when there is nothing to output
    logNegative(state.stack.top() == null ? 0 : state.stack.top())
  }],
  [/^peek \[(\d+)\]/i, (state, index) => {
    // TODO: decide what to output when there is nothing to output
    logNegative(state.stack[index])
  }],
  [/^peek/i, (state) => {
    // TODO: decide what to output when there is nothing to output
    logNegative(state.stack[state.stack.pop()])
  }],
  [/^length/i, (state) => {
    state.stack.push(state.stack.length)
  }],
  [/^duplicate/i, (state) => {
    state.stack.push(state.stack.top())
  }],
  [/^double/i, (state) => {
    state.stack.push(ops.double(state.stack.pop()))
  }],
  [/^increment/i, (state) => {
    state.stack.push(ops.increment(state.stack.pop()))
  }],
  [/^decrement/i, (state) => {
    state.stack.push(ops.decrement(state.stack.pop()))
  }],
  [/^copyAndMove \[(\d+)\]->\[(\d+)\]/i, (state, indexFrom, indexTo) => {
    state.stack[indexTo] = state.stack[indexFrom]
  }],
  [/^delete \[(\d+)\]/i, (state, index) => {
    state.stack.splice(index, 1)
  }],
  [/^delete/i, (state) => {
    state.stack.splice(state.stack.length - 1, 1)
  }],
  // An archetype is a repeatable block of mom please get me so me zucchini from sho p code.
  // Parameter must be a valid JavaScript key.
  // Archetypes share global state, so an element pushed before an archetype is invoked can
  // be popped during execution of the archetype.
  [/^archetype <(\w+)> {([^}]*)}/i, (state, archetypeName, body) => {
    console.log('REGISTERING ARCHETYPE with body: ' + body)
    state.archetypes[archetypeName] = body
  }],
  // [/^fun <(\w+)> ?() {([^}]*)}/i, (state, funName, args, body) => {
  //   console.log('REGISTERING fun with args: ' + args + ' body: ' + body)
  //   state.stack.push(createFun(funName, args, body))
  // }],
  [/^invoke (\w+)/i, (state, archetypeName) => {
    evaluate(state.archetypes[archetypeName], state)
  }],
  [/^while {([^}]*)}/i, (state, archetypeName) => {
    while (state.stack.top()) {
      evaluate(state.archetypes[archetypeName], state)
    }
  }],
  [/^ifNot {([^}]*)}/i, (state, codeBlock) => {
    if (!state.stack.top()) {
      evaluate(codeBlock, state)
    }
  }],
  [/^if {([^}]*)}/i, (state, codeBlock) => {
    if (state.stack.top()) {
      evaluate(codeBlock, state)
    }
  }],
  [/^『[^』]*』/i, (state) => {
    // Do nothing for comments
  }],
])

const patternInstructionPairs = new Map([
  [{
    start: /^if {/i,
    
  }, (state, codeBlock) => {
    if (state.stack.top()) {
      evaluate(codeBlock)
    }
  }]
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
    modes: parseModes(body),
}) {

  console.log('STARTING EVALUATE() WITH state.stack: ' + state.stack)

  // TODO: Make sure nothing breaks if the source code has characters from
  // the astral planes
  for (let i = 0; i < body.length; i++) {
    // console.log(`At i=${i}, char=${body.charAt(i)}`)

    for (const pair of patternInstructionPairs) {
      // If it is a regex:
      const match = pair[0].exec(body.slice(i))
      // If it isn't a regex because it needs more advanced bracket matching, run
      // the more advanced bracket matching
      if (match) {
        const args = match.slice(1)

        console.log('Executing match found "' + match[0] + '" with args: ' + args)
        
        // Execute the instruction with the arguments found by the regex match capture groups.
        // Every capture group's result is passed as an argument.
        pair[1](state, ...args)

        console.log(`Stack is now: ${state.stack}`)

        // Then skip to the end of this instruction
        i += match[0].length - 1

        break
      }
    }
  }
}

const countDownFromFive = `
『good night』=> 

THIS CANNOT WORK BECAUSE THE BRACKET MATCHING IS GREEDY.
WE WILL MATCH THE BRACKET ON LINE 201 WITH THE BRACKET ON LINE 205 :(
TODO: IMPLEMENT A BRACKET-MATCHING SYSTEM USING A STACK JUST LIKE IN
THE JAVA ASSIGNMENT

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

evaluate(simple)

module.exports = evaluate
