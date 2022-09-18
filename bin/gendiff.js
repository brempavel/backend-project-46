#!/usr/bin/env node

import { program } from 'commander';
import fs from 'fs';
import path from 'path';
import _ from 'lodash';

const genDiff = (data1, data2) => {
  const keys1 = Object.keys(data1);
  const keys2 = Object.keys(data2);
  const keys = _.sortBy(_.union(keys1, keys2));

  const hasProperty = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
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

export default function gendiff() {
  program
    .name('gendiff')
    .description('Compares two configuration files and shows a difference.')
    .argument('<filepath1>')
    .argument('<filepath2>')
    .version('0.0.1')
    .option('-f, --format <type>', 'output format')
    .action((path1, path2) => {
      const cwd = process.cwd();
      const filepath1 = path.resolve(cwd, path1);
      const filepath2 = path.resolve(cwd, path2);
      const data1 = JSON.parse(fs.readFileSync(filepath1, 'utf-8'));
      const data2 = JSON.parse(fs.readFileSync(filepath2, 'utf-8'));

      console.log(genDiff(data1, data2));
    });
  program.parse();
}
gendiff();
