import { test, expect } from '@jest/globals';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import genDiff from '../src/index';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getPath = (name) => path.join(__dirname, '..', '__fixtures__', name);

test('plain JSON', () => {
  const expected = fs.readFileSync(getPath('plainResult.txt'), 'utf-8');
  expect(genDiff(getPath('file1.json'), getPath('file2.json'))).toEqual(expected);
});
