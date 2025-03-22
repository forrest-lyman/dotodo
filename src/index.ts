#!/usr/bin/env node

import { Command } from 'commander';
import dotodo from './actions/dotodo';
import dotenv from 'dotenv';
dotenv.config();

const program = new Command();

program
  .name('dotodo')
  .description('Do-To-Do CLI')
  .argument('<files...>', 'Glob patterns to match files')
  .action(async (files: string[]) => {
    await dotodo({
      files,
      root: process.cwd()
    });
  });

program.parseAsync();
