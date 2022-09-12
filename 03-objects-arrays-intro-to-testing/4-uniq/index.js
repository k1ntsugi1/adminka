/**
 * uniq - returns array of uniq values:
 * @param {*[]} arr - the array of primitive values
 * @returns {*[]} - the new array with uniq values
 */
// export function uniq(arr) {
//     const arrayOfUniqItems = new Set(arr);
//     return Array.from(arrayOfUniqItems);
// }

// так как проспойлерили данный метод на занятии, то вот другая реализация:

export function uniq(arr = []) {
    return arr.reduce((acc, item) => {
        if(!acc.includes(item)) acc.push(item);
        return acc;
    }, []);
};

// <-------------------------------------Вопрос--------------------------->
//  Если у нас огромный массив из уникальных ключей, то лучше использовать реализацию, что ниже?
//  т.к acc.includes(item) при каждой итерации будет пробегаться по постепенно
//  заполняющемуся массиву, а в реализации, что ниже мы сразу узнаем уникальный текущий ключ или нет

// export function uniq(arr = []) {
    // const accOfUniqKeys = Object.create(null, {
    //     uniqKeys: { // для правильного порядка items
    //         value : [],
    //         writable: true,
    //         configurable: true,
    //         enumerable: false
    //     }
    // }); // вдруг в массиве будут строки совпадающие с названием методов

    // const objOfUniqKeys = arr.reduce((acc, item) => {
    //     if(!Object.hasOwn(acc, item)) {
    //         acc[item] = item;
    //         acc.uniqKeys.push(item)
    //     };
    //     return acc;
    // }, accOfUniqKeys);

    // return objOfUniqKeys.uniqKeys;
// };
