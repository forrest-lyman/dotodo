import * as fs from 'fs';
import * as path from 'path';



export interface Todo {
  id: string;
  filepath: string;
  line: number;
  text: string;
  status?: 'new' | 'pending' | 'done';
  [key: string]: any; // allow extra fields from config
}

export default function getTodosFromText(text: string, config: Partial<Omit<Todo, 'id' | 'line' | 'text'>>): Todo[] {
  const lines = text.split('\n');
  return lines.map((line: string, i: number) => {
    const todo = getTodo(line);

    const filepath = config.filepath ?? 'unknown';
    const id = `${filepath}-${i}`;
    return !! todo ? {
      id,
      filepath,
      line: i,
      text: todo,
      status: 'new'
    } as Todo : null;
  }).filter(l => l !== null) as Todo[];
}

function getTodo(text: string): string | null {
  const regex = /\/\/\s*todo\s*:?\s*(.*)/i;
  const match = text.match(regex);
  return match ? match[1].trim() : null;
}

// Static class to manage skipped todos
export class TodoRegistry {
  private static skipped: Set<string> = new Set();
  private static readonly ignoreFile = path.resolve('.dotodo/.dotodoignore');

  // Load from file once on first access
  private static loaded = false;
  private static load(): void {
    if (TodoRegistry.loaded) return;
    try {
      const contents = fs.readFileSync(TodoRegistry.ignoreFile, 'utf-8');
      const lines = contents.split('\n').map(line => line.trim()).filter(Boolean);
      lines.forEach(line => TodoRegistry.skipped.add(line));
    } catch (err) {
      // File may not exist yet—ignore
    }
    TodoRegistry.loaded = true;
  }

  private static save(): void {
    fs.writeFileSync(
      TodoRegistry.ignoreFile,
      [...TodoRegistry.skipped].join('\n') + '\n',
      'utf-8'
    );
  }

  static skip(todo: Todo): void {
    TodoRegistry.load();
    if (!TodoRegistry.skipped.has(todo.text)) {
      TodoRegistry.skipped.add(todo.text);
      TodoRegistry.save();
    }
  }

  static isSkipped(todo: Todo): boolean {
    TodoRegistry.load();
    return TodoRegistry.skipped.has(todo.text);
  }

  static reset(): void {
    TodoRegistry.skipped.clear();
    try {
      fs.unlinkSync(TodoRegistry.ignoreFile);
    } catch (err) {
      // File may not exist—ignore
    }
  }
}
