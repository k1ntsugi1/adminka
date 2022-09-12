/**
 * omit - creates an object composed of enumerable property fields
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to omit
 * @returns {object} - returns the new object
 */
export const omit = (startObj, ...fields) => {
    return Object.fromEntries(
        Object.entries(startObj).filter(([key]) => !fields.includes(key))
    )

};
