/**
 * Sum - returns sum of arguments if they can be converted to a number
 * @param {number} n value
 * @returns {number | function}
 */
export function sum (number = 0) {
  let accumulator = number;

  const nextSum = (nextNumber = 0) => {
    accumulator += nextNumber;
    return nextSum;  
  };
  nextSum.toString = function() {
    return accumulator;
  };
  
  return nextSum;
}