#!/usr/bin/env node

import { program } from 'commander';

export default function gendiff() {
  program
    .name('gendiff')
    .description('Compares two configuration files and shows a difference.')
    .arguments('<filepath1><filepath2>')
    .version('0.0.1');

  program
    .option('-f, --format <type>', 'output format')
    
  program.parse();
};
gendiff();
