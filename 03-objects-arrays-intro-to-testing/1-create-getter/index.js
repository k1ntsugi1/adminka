/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
    const queueOfPaths = path.split('.');
    let currentResultOfSearching;
    const getter = (currentObj) => {
        if(!queueOfPaths.length) return currentResultOfSearching;
        const currentPath = queueOfPaths.shift();
        if(!Object.hasOwn(currentObj, currentPath)) return undefined;
        currentResultOfSearching = currentObj[currentPath]
        return getter(currentObj[currentPath]);
    };
    return getter
}
