import logging from './output'
import evaluate from './evaluate'

function recursiveInstruction (start, openingDelimiter='{', closingDelimiter='}') {
  return {
    start,
    openingDelimiter,
    closingDelimiter,
    recursive: true
  }
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
  [/^(?:modulus|mod)/i, (state) => {
    state.stack.push(operators.modulus(state.stack.pop(), state.stack.pop()))
  }],
  [/^pop/i, (state) => {
    // TODO: decide what to output when there is nothing to output
    logging.log(state.stack.top() == null ? 0 : state.stack.pop())
  }],
  [/^top/i, (state) => {
    // TODO: decide what to output when there is nothing to output
    logging.log(state.stack.top() == null ? 0 : state.stack.top())
  }],
  [/^(?:peek|pek) \[(\d+)\]/i, (state, index) => {
    // TODO: decide what to output when there is nothing to output
    logging.log(state.stack[index])
  }],
  [/^(?:peekTop|top)/i, (state) => {
    // TODO: decide what to output when there is nothing to output
    logging.log(state.stack.top())
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
  [/^(?:equal|eql)/i, (state) => {
    state.stack.push(state.stack.pop() == state.stack.pop())
  }],
  // [/^fun <(\w+)> ?() {([^}]*)}/i, (state, funName, args, body) => {
  //   console.log('REGISTERING fun with args: ' + args + ' body: ' + body)
  //   state.stack.push(createFun(funName, args, body))
  // }],
  [/^(?:invoke|inv) (\w+)/i, (state, archetypeName) => {
    evaluate(state.archetypes[archetypeName], state)
  }],
  [/^(?:exi?t|(?:good)?bye)/i, (state) => {
    process.exit(0)
  }],
  /* Instructions requiring recursive pattern-matching */
  [recursiveInstruction(/^(?:while|whi) {/i), (state, codeBlock) => {
    while (state.stack.top()) {
      evaluate(codeBlock, state)
    }
  }],
  [recursiveInstruction(/^(?:if|ift) {/i), (state, codeBlock) => {
      if (state.stack.top()) evaluate(codeBlock, state)
    }
  ],
  [recursiveInstruction(/^(?:ifNot|iff) {/i), (state, codeBlock) => {
    if (!state.stack.top()) {
      evaluate(codeBlock, state)
    }
  }],
  [recursiveInstruction(/^(?:twice|twi) {/i), (state, codeBlock) => {
      evaluate(codeBlock, state)
      evaluate(codeBlock, state)
    }
  ],
  // An archetype is a repeatable block of mom please get me so me zucchini from sho p code.
  // Parameter must be a valid JavaScript key.
  // Archetypes share global state, so an element pushed before an archetype is invoked can
  // be popped during execution of the archetype.
  [recursiveInstruction(/^(?:archetype|arc) <(\w+)> {/i), (state, archetypeName, codeBlock) => {
    logging.logBlue('REGISTERING ARCHETYPE with body: ' + codeBlock)
    state.archetypes[archetypeName] = codeBlock
  }],
  [recursiveInstruction(/^{/i), (state, codeBlock) => {
    // Code blocks should simply be evaluated
      evaluate(codeBlock, state)
    }
  ],
  [recursiveInstruction(/^(?:hold on|ign) <~/i, '<~', '~>'), (state, codeBlock) => {
      /* Do nothing for comments */
    }
  ],
])

export default patternInstructionPairs
