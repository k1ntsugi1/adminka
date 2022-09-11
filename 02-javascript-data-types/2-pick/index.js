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
    const isObject = (value) =>  typeof value === 'object' && value !== null;
    const isArray = (value) => Array.isArray(value);

    const getPickedObj = (currentValue) => {
        if (!isObject(currentValue)) return currentValue;
        if (isArray(currentValue)) return currentValue.map(getPickedObj);

        const reducedCurrentValue = Object.entries(currentValue).reduce((acc, [key, value]) => {
            if (objOfFields[key]) acc[key] = getPickedObj(value); 
            return acc;
        }, {});

        return reducedCurrentValue;
    };
    return getPickedObj(startObj);
};

// для прошлой реализации при "не плоских" объектах: 
// пришлось бы пробегаться по массивам и проверять их содержимое, что раздует код.
// Я посмотрел тесты и понял какая реализация требуется.
// (изначально я воспринял условие иначе, в след раз буду смотреть тесты, для полного понимания задачи) 
