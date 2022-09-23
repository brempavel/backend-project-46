import fs from 'fs';
import path from 'path';
import parse from './parsers.js';
import getDiff from './getdiff.js';
import format from './formatters/index.js';

export default (filepath1, filepath2, formatName = 'stylish') => {
  const oldData = fs.readFileSync(filepath1, 'utf-8');
  const newData = fs.readFileSync(filepath2, 'utf-8');

  const oldExtension = path.extname(filepath1).slice(1);
  const newExtension = path.extname(filepath2).slice(1);

  const oldParsedData = parse(oldData, oldExtension);
  const newParsedData = parse(newData, newExtension);

  const rawDifference = getDiff(oldParsedData, newParsedData);
  const difference = format(rawDifference, formatName);

  return difference;
};
