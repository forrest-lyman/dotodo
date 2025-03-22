export interface Todo {
  id: string;
  filepath: string;
  line: number;
  text: string;
  status?: 'new' | 'pending' | 'done';
  [key: string]: any; // allow extra fields from config
}

const TAG_REGEX = /(?:\/\/|#|<!--|\/\*|\*)\s*(todo|fixme|bug|note|hack|xxx)\s*[:\-]?\s*(.*?)\s*(?:-->|\/\*)?/i;

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

