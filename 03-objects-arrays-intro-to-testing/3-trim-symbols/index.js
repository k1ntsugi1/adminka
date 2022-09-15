/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size = string.length) {
  const { arrOfTrimmedSymb } = string.split('').reduce((acc, currentSymb) => {
    if (acc.observableSymb !== currentSymb) {
      acc.observableSymb = currentSymb;
      acc.counterSymb = 1;
    }
    if (acc.counterSymb <= size) {
      acc.counterSymb += 1;
      acc.arrOfTrimmedSymb.push(currentSymb);
    }
    return acc;
  }, { observableSymb: null, counterSymb: null, arrOfTrimmedSymb: [] });
  return arrOfTrimmedSymb.join('');
}
