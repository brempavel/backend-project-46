import _ from 'lodash';

const hasProperty = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);

export default function getDiff(oldParsedData, newParsedData) {
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
      type: 'updated',
      oldValue: oldParsedData[key],
      newValue: newParsedData[key],
    };
  });
  return elements;
}
