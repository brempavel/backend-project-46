import _ from 'lodash';
import fs from 'fs';
import parse from './parsers.js';
import stylish from './stylish.js';

const hasProperty = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);

const getDiff = (oldParsedData, newParsedData) => {
  const oldKeys = Object.keys(oldParsedData);
  const newKeys = Object.keys(newParsedData);
  const keys = _.sortBy(_.union(oldKeys, newKeys));

  const elements = keys.map((key) => {
    if (!hasProperty(oldParsedData, key)) {
      return {
        key,
        type: 'added',
        value: newParsedData[key],
      };
    }
    if (!hasProperty(newParsedData, key)) {
      return {
        key,
        type: 'removed',
        value: oldParsedData[key],
      };
    }

    if (_.isObject(oldParsedData[key]) && _.isObject(newParsedData[key])) {
      return {
        key,
        type: 'nested',
        value: getDiff(oldParsedData[key], newParsedData[key]),
      };
    }
    if (oldParsedData[key] === newParsedData[key]) {
      return {
        key,
        type: 'unchanged',
        value: oldParsedData[key],
      };
    }
    return {
      key,
      type: 'changed',
      oldValue: oldParsedData[key],
      newValue: newParsedData[key],
    };
  });
  return elements;
};

export default (filepath1, filepath2) => {
  const oldData = fs.readFileSync(filepath1, 'utf-8');
  const newData = fs.readFileSync(filepath2, 'utf-8');

  const oldExtension = filepath1.split('.').pop();
  const newExtension = filepath2.split('.').pop();

  const oldParsedData = parse(oldData, oldExtension);
  const newParsedData = parse(newData, newExtension);

  const rawDifference = getDiff(oldParsedData, newParsedData);
  const difference = stylish(rawDifference);
  return difference;
};
