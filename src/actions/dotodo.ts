import fs from 'fs';
import inquirer from 'inquirer';
import getTodosFromText, {Todo} from '../lib/todo';
import chalk from 'chalk';
import ora from 'ora';
import { z } from 'zod';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';
import {zodResponseFormat} from 'openai/helpers/zod';
dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });




export default async function dotodo(options: any) {
  if (!options.files || options.files.length === 0) {
    throw new Error('Invalid request: no file matches');
  }

  console.log(chalk.white(`DoToDo v1.0`));

  const { confirmRead } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmRead',
      message: `Preparing to index ${options.files.length} file(s). Would you like to proceed?`,
      default: true,
    },
  ]);

  if (!confirmRead) {
    console.log('Aborted reading files.');
    return;
  }

  const todos: Todo[] = options.files.reduce((acc, filepath) => {
    return acc.concat(
      getTodosFromText(fs.readFileSync(filepath, 'utf-8'), {filepath})
    );
  }, [] as Todo[]);

  console.log(chalk.green(`\nFound ${todos.length} open todos in your source code.\n`));

  const { processChoice } = await inquirer.prompt([
    {
      type: 'list',
      name: 'processChoice',
      message: `Preparing to process ${todos.length} todo(s). How would you like to proceed?`,
      choices: [
        { name: 'Process todos sequentially', value: 'sequential' },
        { name: 'Process all todos', value: 'all' },
        { name: 'Cancel', value: 'cancel' },
      ],
      default: 'sequential'
    },
  ]);

  if (processChoice === 'cancel') {
    return;
  }

  await processTodos(todos, {sequential: processChoice === 'sequential', projectFiles: options.files});
}

export async function processTodos(todos: Todo[], options: {sequential: boolean, projectFiles: string[]}) {

  for (let todo of todos) {
    console.log(`\n` + chalk.blue(`${todo.filepath}`) + chalk.white(`:${todo.line} - `) + chalk.whiteBright(todo.text));

    if  (options.sequential) {
      const { continueProcessing } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'continueProcessing',
          message: `Would you like to process this todo?`,
          default: true,
        },
      ]);
      if (! continueProcessing) {
        return;
      }
    }
    const spinner = ora(`Processing: ${todo.text}`).start();

    // load context
    spinner.start('Loading file context');
    const context: string[] = [];
    const contextFiles = await getContextFiles(todo, options.projectFiles);
    if (contextFiles) {
      contextFiles.forEach(f => {
        context.push(`Filepath: ${f}`);
        context.push('```');
        context.push(fs.readFileSync(f, 'utf-8'));
        context.push('```');
      })
    }
    spinner.succeed('Loaded file context');

    // generate changes
    spinner.start('Generating code');
    const update = await generate(todo, context.join(`\n`));
    spinner.succeed('Generated code');

    const { applyChoice } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'applyChoice',
        message: `Update: ${update.message} . Would you like to proceed?`,
        default: true,
      },
    ]);

    if (!applyChoice) {
      console.log('Skipping updates...');
      return;
    }

    // apply changes
    spinner.start('Applying changes to source code');
    const final = await applyChanges(todo, update);
    spinner.succeed('Finished updating source code');
  }
}

async function getContextFiles(todo: Todo, files: string[]): Promise<any> {
  const prompt = [
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

  const response = await openai.beta.chat.completions.parse({
    model: 'gpt-4o-2024-08-06',
    messages: [
      { role: 'user', content: prompt }
    ],
    temperature: 0.2,
    response_format: zodResponseFormat(fileListSchema, "files"),
  });

  const data: any = response.choices[0].message.parsed;
  return data?.files || [];
}

async function generate(todo: Todo, context: any): Promise<any> {
  const systemPrompt = [
    `You are updating code, completing individual tasks that are specified by // todo tags`,
    `The user will pass you the change requested and the line number of the todo tag`,
    `You should only complete the specific todo task that the user passes.`,
    `Replace the original "// todo..." tag on that line with "// dotodo: {current timestamp}...`,
    `Make the appropriate updates to the source code, then return the entire new file contents (not just the udpated code)`
  ].join(`\n`);

  const prompt = [
    `Please update this source code, completing the following task: "${todo.text}" on line: ${todo.line} of this file:`,
    JSON.stringify({
      filepath: todo.filepath,
      sourceCode: fs.readFileSync(todo.filepath, 'utf-8')
    }),
    `Here are some relevant files that might be helpful when you update this code:`,
    context
  ].join(`\n`)

  const updateSchema = z.object({
    message: z.string({description: 'Briefly explain the changes, noting the line numbers that are changed'}),
    source: z.string({description: 'The updated file contents'}),
  });

  const response = await openai.beta.chat.completions.parse({
    model: 'gpt-4o-2024-08-06',
    messages: [
      { role: 'system', content: systemPrompt},
      { role: 'user', content: prompt }
    ],
    temperature: 0.2,
    response_format: zodResponseFormat(updateSchema, "updates"),
  });

  const data: any = response.choices[0].message.parsed;
  return {
    message: data.message,
    source: data.source
  }
}

import * as fs from 'fs';
import * as path from 'path';

interface Todo {
  filepath: string;
}

async function applyChanges(todo: Todo, update: any): Promise<void> {
  const cacheDir = '.dotodo';

  // Ensure cache directory exists
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir);
  }

  const { filepath } = todo;

  // Create a unique backup filename in the cache directory
  const fileName = path.basename(filepath);
  const timestamp = Date.now();
  const backupPath = path.join(cacheDir, `${fileName}.${timestamp}.bak`);

  // Save existing file to backup
  fs.copyFileSync(filepath, backupPath);

  // Update the source code
  const { source } = update;
  fs.writeFileSync(filepath, source, 'utf-8');
}
