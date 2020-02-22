/* For each key in objectA and objectB, that key in the returned object will
 * be true if it is true in either objectA or objectB, or false if it is false
 * on both objectA and objectB.
 *
 * Expects objectA and objectB to be simple objects without advanced
 * properties like non-enumerable keys etc.
 * Expects objectA and objectB's values to be of type boolean.
 */
export function bestOfBoth (objectA, objectB) {
  const result = {}

  // NOTE: Careful with for ... in
  for (const key in objectA) {
    if (objectA[key] || objectB[key]) result[key] = true
    else result[key] = false
  }

  for (const key in objectB) {
    if (objectA[key] || objectB[key]) result[key] = true
    else result[key] = false
  }

  return result
}
