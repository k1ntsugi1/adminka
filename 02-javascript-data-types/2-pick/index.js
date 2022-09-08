/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */
export const pick = (startObj, ...fields) => {

    // <------------То что закомментировано работает, тесты обрабатываются за ~8sec-------------->
    // const objOfFields  = fields.reduce((acc, item) => {
    //     acc[item] = item;
    //     return acc;
    // }, {});

    // const getPickedObj = (currentObj) => {
    //     const reducedCurrentObj = Object.entries(currentObj).reduce((acc, [key, value]) => {
    //         if (objOfFields[key]) {
    //             acc[key] = typeof value === 'object' ? getPickedObj(value) : value;
    //         }
    //         return acc;
    //     }, {});
    //     return reducedCurrentObj;
    // };
    // return getPickedObj(startObj);

    // <---Не знаю какое значение BigO ниже, но код гораздо короче и понятнее, а также тесты обрабатываются за ~5sec------>

    const jsonWithPickedFields = JSON.stringify(startObj, fields);
    return JSON.parse(jsonWithPickedFields);
};
