/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size = string.length) {
    const reducedString = string.split('').reduce((acc, item) => {
        if (acc.currentStr !== item) {
            acc.currentStr = item;
            acc.counter = 1;
        }
        if (acc.counter <= size) {
            acc.counter += 1;
            acc.arrOfTrimmedSymb.push(item);
        }
        return acc;
    }, { currentStr: null, counter: null, arrOfTrimmedSymb: [] });
    return reducedString.arrOfTrimmedSymb.join('');
};
