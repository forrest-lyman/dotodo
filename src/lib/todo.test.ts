import getTodosFromText from './todo';

describe('getTodosFromText', () => {
  it('extracts TODO comments with line numbers and tags', () => {
    const text = `
      // TODO: implement this
      //todo: handle edge case
      const y = 23;
      const x = 42; // TODO: temp var
    `;

    const todos = getTodosFromText(text, { filepath: 'src/test.ts' });

    expect(todos).toHaveLength(3);

    expect(todos[0]).toMatchObject({
      id: 'src/test.ts-1',
      filepath: 'src/test.ts',
      line: 1,
      text: 'implement this',
      status: 'new',
    });
  });

  it('returns an empty array when no tags are found', () => {
    const text = `
      const foo = 1;
      // Just a comment
    `;

    const todos = getTodosFromText(text, { filepath: 'src/test.ts' });

    expect(todos).toHaveLength(0);
  });
});
