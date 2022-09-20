import _ from 'lodash';
import fs from 'fs';
import parse from './parsers.js';

export default (filepath1, filepath2) => {
  const data1 = fs.readFileSync(filepath1, 'utf-8');
  const data2 = fs.readFileSync(filepath2, 'utf-8');
  const extension = filepath1.split('.').pop();
  const parsedData1 = parse(data1, extension);
  const parsedData2 = parse(data2, extension);

  const keys = _.sortBy(_.union(Object.keys(parsedData1), Object.keys(parsedData2)));

  const hasProperty = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
  const rawResult = keys.map((key) => {
    if (hasProperty(parsedData1, key) && hasProperty(parsedData2, key)) {
      if (parsedData1[key] === parsedData2[key]) {
        return {
          name: key,
          type: 'unchanged',
          value: parsedData1[key],
        };
      }
      return {
        name: key,
        type: 'changed',
        value1: parsedData1[key],
        value2: parsedData2[key],
      };
    }
    if (!hasProperty(parsedData1, key)) {
      return {
        name: key,
        type: 'added',
        value: parsedData2[key],
      };
    }
    return {
      name: key,
      type: 'removed',
      value: parsedData1[key],
    };
  });
  const result = rawResult.reduce((acc, string) => {
    switch (string.type) {
      case 'added':
        acc += `  + ${string.name}: ${string.value}\n`;
        break;
      case 'removed':
        acc += `  - ${string.name}: ${string.value}\n`;
        break;
      case 'changed':
        acc += `  - ${string.name}: ${string.value1}\n  + ${string.name}: ${string.value2}\n`;
        break;
      case 'unchanged':
        acc += `    ${string.name}: ${string.value}\n`;
        break;
      default:
        break;
    }
    return acc;
  }, '');
  return `{\n${result}}`;
};
