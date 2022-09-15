/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */

export function createGetter(path) {
  const queueOfPaths = path.split('.');
  const lastIndex = queueOfPaths.length - 1;

  let currentIndexOfPathQueue = 0; // в данном случае не мутирую очередь, а просто пробегаюсь по нему + легче восстанавливать стартовое состояние + функция не одноразовая
  let statusOfSearching = 'pending'; // Ввел наблюдателя, чтобы не повторять приведение currentIndexOfPathQueue к стартовому состоянию несколько раз

  const getter = (currentObj) => {
    const currentPath = queueOfPaths[currentIndexOfPathQueue];
    if (currentIndexOfPathQueue === lastIndex) {statusOfSearching = 'fulfilled';}
    if (!currentObj.hasOwnProperty(currentPath)) {statusOfSearching = 'rejected';}
    if (statusOfSearching !== 'pending') { 
      statusOfSearching = 'pending';
      currentIndexOfPathQueue = 0;
      return currentObj[currentPath];
    }
    currentIndexOfPathQueue += 1;
    return getter(currentObj[currentPath]);
  };
  return getter;
}
