import fs from 'fs';
import path from 'path';
import {Todo} from '../lib/todo';
import chalk from 'chalk';
import normalizeIndentation from '../util/normalize-indentation';
import inquirer from 'inquirer';
import {DoToDo} from '../lib/dotodo';

export interface CodeUpdaterOptions {
  todo: Todo;
  update: any;
}

export interface CodeUpdaterResponse {
  backup: string;
  success: boolean;
}

export default async function codeUpdater({todo, update}: CodeUpdaterOptions): Promise<void> {
  console.log(`\n` + chalk.bgBlue(' PATCH ') + chalk.whiteBright(` ${update.message}\n`));
  console.log(chalk.blue(todo.filepath));

  const patch = normalizeIndentation([
    ...update.patch.slice(0,5),
  ]);

  const lastLine: any = patch.at(-1);
  patch.push({
    line: lastLine.line + 1,
    code: '//...'
  })

  patch.forEach(({line, code}) => {
    console.log(chalk.gray(line) + '  ' + chalk.white(code));
  })

  const { apply } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'apply',
      message: `Would you like to apply this patch?`,
      default: true,
    },
  ]);
  if (! apply) {
    return;
  }

  DoToDo.update(todo.filepath, update.source);
}
