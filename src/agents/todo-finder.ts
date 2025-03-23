import getTodosFromText, {Todo} from '../lib/todo';
import fs from 'fs';

export interface TodoFinderOptions {
  files: string[];
}

export interface TodoFinderResponse {
  todos: Todo[]
}

export default async function todoFinder({files}: TodoFinderOptions): Promise<TodoFinderResponse> {
  const todos: Todo[] = files.reduce((acc, filepath) => {
    return acc.concat(
      getTodosFromText(fs.readFileSync(filepath, 'utf-8'), {filepath})
    );
  }, [] as Todo[]);
  return {
    todos
  }
}
