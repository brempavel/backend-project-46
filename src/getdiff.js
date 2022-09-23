import _ from 'lodash';

const hasProperty = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
const getKeys = (oldData, newData) => {
  const oldKeys = Object.keys(oldData);
  const newKeys = Object.keys(newData);
  return _.sortBy(_.union(oldKeys, newKeys));
};

export default function getDiff(oldParsedData, newParsedData) {
  const keys = getKeys(oldParsedData, newParsedData);
  const elements = keys.map((key) => {
    if (!hasProperty(oldParsedData, key)) {
      return { key, type: 'added', value: newParsedData[key] };
    }
    if (!hasProperty(newParsedData, key)) {
      return { key, type: 'removed', value: oldParsedData[key] };
    }

    if (_.isObject(oldParsedData[key]) && _.isObject(newParsedData[key])) {
      return {
        key,
        type: 'nested',
        value: getDiff(oldParsedData[key], newParsedData[key]),
      };
    }
    if (oldParsedData[key] !== newParsedData[key]) {
      return {
        key,
        type: 'updated',
        oldValue: oldParsedData[key],
        newValue: newParsedData[key],
      };
    }
    return { key, type: 'unchanged', value: oldParsedData[key] };
  });
  return elements;
}
