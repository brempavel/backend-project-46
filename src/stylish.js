import _ from 'lodash';

const getIndentation = (depth, step = 4) => ' '.repeat(depth * step);

const getValue = (item, depth) => {
  if (!_.isObject(item)) {
    return item;
  }
  const indentation = getIndentation(depth);
  const difference = Object.entries(item).map(([key, value]) => `${indentation}${key}: ${getValue(value, depth + 1)}`);
  return [
    '{',
    ...difference,
    `${getIndentation(depth - 1)}}`,
  ].join('\n');
};

export default function stylish(rawDifference, depth = 1) {
  const indentation = getIndentation(depth).slice(0, getIndentation(depth).length - 2);
  const difference = rawDifference.map((element) => {
    switch (element.type) {
      case 'added':
        return `${indentation}+ ${element.key}: ${getValue(element.value, depth + 1)}`;
      case 'removed':
        return `${indentation}- ${element.key}: ${getValue(element.value, depth + 1)}`;
      case 'changed':
        return `${indentation}- ${element.key}: ${getValue(element.oldValue, depth + 1)}\n${indentation}+ ${element.key}: ${getValue(element.newValue, depth + 1)}`;
      case 'unchanged':
        return `${indentation}  ${element.key}: ${getValue(element.value, depth + 1)}`;
      case 'nested':
        return `${indentation}  ${element.key}: ${stylish(element.value, depth + 1)}`;
      default:
        throw new Error(`Unknown element type: ${element.type}`);
    }
  }, []);
  return [
    '{',
    ...difference,
    `${getIndentation(depth - 1)}}`,
  ].join('\n');
}
