import {Todo} from '../lib/todo';
import fs from 'fs';
import {z} from 'zod';
import {prompt} from '../lib/client';
import ora from 'ora';

export interface CodeGeneratorOptions {
  todo: Todo;
  context: string;
}

export interface CodeGeneratorResponse {
  message: string; // message describing update
  source: string; // complete updated file
  patch: {
    line: number;
    code: string;
  }[]; // updated lines of code
}

export default async function codeGenerator({todo, context}: CodeGeneratorOptions): Promise<CodeGeneratorResponse> {
  const systemPrompt = [
    `You are updating code, completing individual tasks that are specified by // todo tags`,
    `The user will pass you the change requested and the line number of the todo tag`,
    `You should only complete the specific todo task that the user passes.`,
    `Replace the "todo" from the original comment with a short but detailed comment based on the task. Append " - DoToDo: {timestamp}" to the end.`,
    `Make the appropriate updates to the source code, then return the entire new file contents (not just the udpated code)`
  ].join(`\n`);

  const userPrompt = [
    `Please update this source code, completing the following task: "${todo.text}" on line: ${todo.line} of this file:`,
    JSON.stringify({
      filepath: todo.filepath,
      sourceCode: fs.readFileSync(todo.filepath, 'utf-8')
    }),
    `Here are some relevant files that might be helpful when you update this code:`,
    context
  ].join(`\n`)

  // Define the schema for validating the response from the prompt, ensuring it contains a message, source, and patch details
  const updateSchema = z.object({
    message: z.string({description: 'Briefly explain the changes, noting the line numbers that are changed'}),
    source: z.string({description: 'The updated file contents'}),
    patch: z.array(
      z.object({
        line: z.number({description: 'The line number'}),
        code: z.string({description: 'The new line of source code (the actual code, not the index)'}),
      })
    ).describe('A list of code patches (in order) with line numbers and updated content')
  });

  const spinner = ora();
  spinner.start('Generating source code patch');
  const data = await prompt([
    { role: 'system', content: systemPrompt},
    { role: 'user', content: userPrompt }
  ], updateSchema);
  spinner.succeed('Generated source code patch');

  return {
    message: data.message,
    source: data.source,
    patch: data.patch
  }
}
