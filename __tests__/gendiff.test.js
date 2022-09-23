import { test, expect } from '@jest/globals';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import genDiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getPath = (name) => path.join(__dirname, '..', '__fixtures__', name);

test('JSON', () => {
  const expected = fs.readFileSync(getPath('resultStylish.txt'), 'utf-8');
  expect(genDiff(getPath('file1.json'), getPath('file2.json'))).toEqual(expected);
});

test('yaml/yml', () => {
  const expected = fs.readFileSync(getPath('resultStylish.txt'), 'utf-8');
  expect(genDiff(getPath('file1.yaml'), getPath('file2.yaml'))).toEqual(expected);
});

test('plain format', () => {
  const expected = fs.readFileSync(getPath('resultPlain.txt'), 'utf-8');
  expect(genDiff(getPath('file1.json'), getPath('file2.json'), 'plain')).toEqual(expected);
  expect(genDiff(getPath('file1.yaml'), getPath('file2.yaml'), 'plain')).toEqual(expected);
});
