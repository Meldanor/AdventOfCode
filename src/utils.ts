import { readFile } from 'node:fs/promises';

async function readInput(file: string): Promise<string[]> {
  const content = await readFile(file, { encoding: 'utf8' });
  const lines = content.split('\n');
  // Remove last line because it is empty
  return lines.slice(0, -1);
}

export { readInput };
