const operators = {
  add: (x, y) => x + y,
  subtract: (x, y) => {
    if (typeof x === 'string' && typeof y === 'string') {
      // 'beetroot' - 'bean' -> 'beet'
      return x.slice(0, y.length)
    } else if (typeof x === 'string' && typeof y === 'number') {
      return x.slice(0, y)
    } else if (typeof x === 'number' && typeof y === 'string') {
      return x - y.length
    } else {
      return x - y
    }
  },
  multiply: (x, y) => {
    if (typeof x === 'string' && typeof y === 'string') {
      return x.repeat(y.length)
    } else if (typeof x === 'string' && typeof y === 'number') {
      return x.repeat(y)
    } else if (typeof x === 'number' && typeof y === 'string') {
      return y.repeat(x)
    } else {
      return x * y
    }
  },
  divide: (x, y) => {
    if (typeof x === 'string' && typeof y === 'string') {
      // WOW. WTF am I doing. In what universe is this consistent.
      return x.slice(0, Math.ceil(x.length / y.length))
    } else if (typeof x === 'string' && typeof y === 'number') {
      return x.slice(0, Math.ceil(x.length / y))
    } else if (typeof x === 'number' && typeof y === 'string') {
      return x / y.length
    } else {
      return x / y
    }
  },
  double: (x) => {
    if (typeof x === 'string') return x.repeat(2)
    else return x * 2
  },
  increment: (x) => operators.add(x, 1),
  decrement: (x) => operators.subtract(x, 1)
}

module.exports = operators
