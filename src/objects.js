/**
 * Find a numerical key of an object within a tolerance span
 */
export function getClosestNumericalKey(items, key, tolerance = 0) {
  for (let i = 1; i <= tolerance; i++) {
    if (items[key + i]) {
      return key + i
    }
    if (items[key - i]) {
      return key - i
    }
  }
  return key
}

/**
 * Sort object by keys and convert to array
 */
export function objectToSortedArray(obj) {
  return Object.keys(obj)
    .map(Number)
    .sort((a, b) => a - b)
    .map((key) => obj[key])
    .flat()
}
