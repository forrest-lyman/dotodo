

export interface Todo {
  id: string; // Computed as `${filepath}-${line}`
  filepath: string;
  line: number;
  text: string;
  status?: 'new' | 'pending' | 'done';
}

export class State {
  private static instance: State;
  private todos: Todo[] = [];

  private constructor() {}

  public static getInstance(): State {
    if (!State.instance) {
      State.instance = new State();
    }
    return State.instance;
  }

  public static get todos(): Todo[] {
    return State.getInstance().todos;
  }

  public static addTodo(todo: Omit<Todo, 'id'>): void {
    const id = `${todo.filepath}-${todo.line}`;
    const newTodo: Todo = { ...todo, id };
    State.getInstance().todos.push(newTodo);
  }

  public static removeTodo(id: string): void {
    const state = State.getInstance();
    state.todos = state.todos.filter(todo => todo.id !== id);
  }

  public static updateTodo(id: string, updates: Partial<Omit<Todo, 'id'>>): void {
    const todo = State.getInstance().todos.find(t => t.id === id);
    if (todo) {
      Object.assign(todo, updates);
    }
  }

  public static clearTodos(): void {
    State.getInstance().todos = [];
  }
}
