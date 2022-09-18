import { genDiff } from '../bin/gendiff';

test('plain JSON', () => {
  const result = `{
    - follow: false
      host: hexlet.io
    - proxy: 123.234.53.22
    - timeout: 50
    + timeout: 20
    + verbose: true
    }`;
    console.log(genDiff('__fixtures__ /file1.json', '__fixtures__ / file2.json'));
  expect(genDiff('__fixtures__ /file1.json', '__fixtures__ / file2.json')).toEqual(
    result
  );
});
