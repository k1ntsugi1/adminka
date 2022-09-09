/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */
export const pick = (startObj, ...fields) => {
    const objOfFields  = fields.reduce((acc, item) => {
        acc[item] = item;
        return acc;
    }, {});

    const getPickedObj = (currentObj) => {
        const reducedCurrentObj = Object.entries(currentObj).reduce((acc, [key, value]) => {
            if (objOfFields[key]) {
                acc[key] = typeof value === 'object' ? getPickedObj(value) : value;
            }
            return acc;
        }, {});
        return reducedCurrentObj;
    };
    return getPickedObj(startObj);

};
