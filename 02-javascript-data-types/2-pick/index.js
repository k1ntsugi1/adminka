/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */
export const pick = (startObj, ...fields) => {
    return Object.fromEntries(
        Object.entries(startObj).filter(([key]) => fields.includes(key))
    )
};

// для прошлой реализации при "не плоских" объектах: 
// пришлось бы пробегаться по массивам и проверять их содержимое, что раздует код.
// Я посмотрел тесты и понял какая реализация требуется.
// (изначально я воспринял условие иначе, в след раз буду смотреть тесты, для полного понимания задачи) 
