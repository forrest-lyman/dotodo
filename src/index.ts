#!/usr/bin/env node

import dotenv from 'dotenv';
import * as agents from './agents';
import chalk from 'chalk';
import fg from 'fast-glob';
import inquirer from 'inquirer';
import {TodoRegistry} from './lib/todo';
import {DoToDo} from './lib/dotodo';

dotenv.config();

DoToDo.init();

async function main(index = 0) {
  const args = process.argv.slice(2); // Skip 'node' and script path

  if (args.length === 0) {
    console.log(chalk.red('No files specified. Usage: dotodo <files...>'));
    process.exit(1);
  }

  // Use fast-glob to resolve file patterns
  const files = await fg(args, {
    onlyFiles: true,
    unique: true,
    absolute: false, // or true if todoFinder expects absolute paths
  });

  if (files.length === 0) {
    console.log(chalk.yellow('No matching files found.'));
    process.exit(0);
  }

  // find the todos in the files
  const todoFinderResponse = await agents.todoFinder({ files });

  const todos = todoFinderResponse.todos.filter(t => ! TodoRegistry.isSkipped(t));

  if (todos.length === 0) {
    console.log(chalk.yellow(`No todos found in ${files.length} files.`));
    process.exit(0);
  }

  // run the next todo
  const todo = todos[index];
  console.log(`\n` + chalk.blue(`${todo.filepath}`) + chalk.white(`:${todo.line} `) + chalk.whiteBright(todo.text));
  const { continueProcessing } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'continueProcessing',
      message: `Would you like to process this todo?`,
      default: true,
    },
  ]);
  if (! continueProcessing) {
    TodoRegistry.skip(todo);
    return main();
  }

  const context = await agents.fileContext({todo, files});

  const update = await agents.codeGenerator({todo, context});

  const complete = await agents.codeUpdater({todo, update});

  // when you are complete move to the next issue
  return main();
}

main().catch(err => {
  console.error(chalk.red('Error running dotodo:'), err);
  process.exit(1);
});
