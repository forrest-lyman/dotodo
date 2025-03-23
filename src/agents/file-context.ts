import {Todo} from '../lib/todo';
import fs from 'fs';
import {Todo} from '../lib/todo';
import chalk from 'chalk';
import ora from 'ora';
import { z } from 'zod';
import {prompt} from '../lib/client';
import inquirer from 'inquirer';

export interface FileContextOptions {
  todo: Todo;
  files: string[];
}

export interface FileContextResponse {
  fileContext: string;
}

export default async function fileContext({todo, files}: FileContextOptions): Promise<FileContextResponse | any> {
  const userPrompt = [
    'This project contains the following files:',
    ...files.map(f => ` > ${f}`),
    '',
    'You are updating code, working on the following file:',
    todo.filepath,
    '',
    'The file source code is:',
    '```',
    fs.readFileSync(todo.filepath, 'utf-8'),
    '```',
    '',
    `The user has requested that you: "${todo.text}" on line ${todo.line}`,
    `Return a list of all of the files that might be relevant for completing this task`
  ].join('\n');

  const fileListSchema = z.object({
    files: z.array(z.string()),
  });

  const spinner = ora(`Processing: ${todo.text}`);
  spinner.start('Loading file context');
  const data = await prompt([
    { role: 'user', content: userPrompt }
  ], fileListSchema);

  const contextFiles = [...data.files];
  spinner.succeed('Loaded file context');

  console.log(`\n` + chalk.yellowBright(`The LLM has requested read access to the following files:` + `\n`))

  const { selected } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'selected',
      message: 'Select files to include:',
      choices: contextFiles.map(file => ({
        name: file,
        value: file,
        checked: true
      })),
      pageSize: 10,
      loop: false,
    }
  ]);

  const context = selected.reduce((acc, f) => {
    return [
      ...acc,
      `Filepath: ${f}`,
      '```',
      fs.readFileSync(f, 'utf-8'),
      '```',
    ]
  }, [] as string[]);

  return {
    fileContext: context.join(`\n`)
  }
}
