import fs from 'fs';
import _ from 'lodash';

export const genDiff = (filepath1, filepath2) => {
  const data1 = JSON.parse(fs.readFileSync(filepath1, 'utf-8'));
  const data2 = JSON.parse(fs.readFileSync(filepath2, 'utf-8'));

  const keys1 = Object.keys(data1);
  const keys2 = Object.keys(data2);
  const keys = _.sortBy(_.union(keys1, keys2));

  const hasProperty = (obj, prop) =>
    Object.prototype.hasOwnProperty.call(obj, prop);
  const rawResult = keys.map((key) => {
    if (hasProperty(data1, key) && hasProperty(data2, key)) {
      if (data1[key] === data2[key]) {
        return {
          name: key,
          type: 'unchanged',
          value: data1[key],
        };
      }
      return {
        name: key,
        type: 'changed',
        value1: data1[key],
        value2: data2[key],
      };
    }
    if (!hasProperty(data1, key)) {
      return {
        name: key,
        type: 'added',
        value: data2[key],
      };
    }
    if (!hasProperty(data2, key)) {
      return {
        name: key,
        type: 'removed',
        value: data1[key],
      };
    }
    return '';
  });
  const result = rawResult.reduce((acc, string) => {
    switch (string.type) {
      case 'added':
        acc += `+ ${string.name}: ${string.value}\n`;
        break;
      case 'removed':
        acc += `- ${string.name}: ${string.value}\n`;
        break;
      case 'changed':
        acc += `- ${string.name}: ${string.value1}\n+ ${string.name}: ${string.value2}\n`;
        break;
      case 'unchanged':
        acc += `  ${string.name}: ${string.value}\n`;
        break;
      default:
        break;
    }
    return acc;
  }, '');
  return `{\n${result}}`;
};