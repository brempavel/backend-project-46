import { test, expect, beforeAll } from '@jest/globals';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import genDiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getPath = (name) => path.join(__dirname, '..', '__fixtures__', name);

let expected;
beforeAll(() => {
  expected = fs.readFileSync(getPath('result.txt'), 'utf-8');
});

test('plain JSON', () => {
  expect(genDiff(getPath('file1.json'), getPath('file2.json'))).toEqual(expected);
});

// test('yaml/yml', () => {

// })
