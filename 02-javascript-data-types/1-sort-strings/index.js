/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */

 const configOfComparing = {
    locales: ["ru", "en"], // порядок важен
    options: {
        caseFirst: 'upper',
        numeric: true,
    }
}

export function sortStrings(arr, param = 'asc') {
    const paramOfShift = param === 'asc' ? 1 : -1;
    const copyOfArr = [...arr];
    const sortedArr = copyOfArr.sort((firstStr, secondStr) => {
        const resultOfComparing = firstStr.localeCompare(secondStr, configOfComparing.locales, configOfComparing.options);
        return resultOfComparing * paramOfShift;
    });
    return sortedArr;
}
