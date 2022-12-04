import { readFile } from 'node:fs/promises';

async function readInput(file: string): Promise<string[]> {
  const content = await readFile(file, { encoding: 'utf8' });
  const lines = content.split('\n');
  // Remove last line because it is empty
  return lines.slice(0, -1);
}

function range(size: number, startAt = 0) {
  return [...Array(size).keys()].map((i) => i + startAt);
}

function chunk<T>(array: Array<T>, chunkSize: number): Array<Array<T>> {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize);
    chunks.push(chunk);
  }
  return chunks;
}

export { readInput, range, chunk };
