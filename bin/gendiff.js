#!/usr/bin/env node

import { Command } from 'commander';
import path from 'path';
import genDiff from '../src/index.js';

const program = new Command();
program
  .name('gendiff')
  .description('Compares two configuration files and shows a difference.')
  .argument('<filepath1>')
  .argument('<filepath2>')
  .version('0.0.1')
  .option('-f, --format <type>', 'output format', 'stylish')
  .action((path1, path2, options) => {
    const cwd = process.cwd();
    const filepath1 = path.resolve(cwd, path1);
    const filepath2 = path.resolve(cwd, path2);

    console.log(genDiff(filepath1, filepath2, options.format));
  });
program.parse();
