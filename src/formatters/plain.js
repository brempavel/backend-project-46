import _ from 'lodash';

const getValue = (element) => {
  if (_.isObject(element)) {
    return '[complex value]';
  }
  return _.isString(element) ? `'${element}'` : element;
};

export default function plain(rawDifference, parentElement = '') {
  const difference = rawDifference.flatMap((element) => {
    const path = parentElement === '' ? element.key : [parentElement, element.key].join('.');
    switch (element.type) {
      case 'added':
        return `Property '${path}' was added with value: ${getValue(element.value)}`;
      case 'removed':
        return `Property '${path}' was removed`;
      case 'updated':
        return `Property '${path}' was updated. From ${getValue(element.oldValue)} to ${getValue(element.newValue)}`;
      case 'unchanged':
        return null;
      case 'nested':
        return plain(element.value, path);
      default:
        throw new Error(`Unknown element type: ${element.type}`);
    }
  }, []);
  return difference.filter((element) => element !== null).join('\n');
}
