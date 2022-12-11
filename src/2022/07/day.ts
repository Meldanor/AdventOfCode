enum Executable {
  CD = 'cd',
  LS = 'ls'
}

interface Command {
  executable: Executable;
  arguments?: string;
}

interface FileOutput {
  isDir: boolean;
  fileName: string;
  fileSize?: number;
}

interface LineAction {
  command?: Command;
  output?: FileOutput;
}

interface VirtualFile {
  isDir: boolean;
  fileSize: number;
  fileName: string;
  files: Map<string, VirtualFile>;
  parent?: VirtualFile;
}

function run(content: string[]): void {
  const actions = parseInput(content);
  const fileTree = buildFileTree(actions);
  printTree(fileTree);
  // Part 1
  const part1Directories = findDirectoriesLessThan(fileTree, 100_000);
  const sumOfDirectories = part1Directories.reduce(
    (sum, file): number => sum + file.fileSize,
    0
  );
  console.log(
    `(Part 1): The sum of all the directories with size under 100_000 is '${sumOfDirectories}'`
  );
  // Part 2
  const neededSpace = 30_000_000 - (70_000_000 - fileTree.fileSize);
  const directoryToDelete = findMinimalDirectoryToDelete(fileTree, neededSpace);

  console.log(
    `(Part 2): The total size of the directory to delete to free ${neededSpace} is '${directoryToDelete.fileSize}'`
  );
}

function parseInput(lines: string[]): LineAction[] {
  return lines.map((line): LineAction => {
    const split = line.split(' ');
    // Is a command
    if (split[0] === '$') {
      return {
        command: {
          executable: split[1] as Executable,
          arguments: split.length === 3 ? split[2] : undefined
        }
      };
    }
    // Is an output
    else {
      const isDir = split[0] === 'dir';
      return {
        output: {
          isDir: isDir,
          fileName: isDir ? split[1] : split[1],
          fileSize: isDir ? undefined : Number.parseInt(split[0])
        }
      };
    }
  });
}

function buildFileTree(actions: LineAction[]): VirtualFile {
  const root: VirtualFile = {
    fileName: '/',
    isDir: true,
    files: new Map(),
    fileSize: 0
  };
  const actionsCopy = structuredClone(actions);
  const firstAction = actionsCopy.shift() as LineAction;

  buildFileTreeRec(firstAction, actionsCopy, root);
  return root;
}

function buildFileTreeRec(
  curAction: LineAction,
  nextActions: LineAction[],
  curNode: VirtualFile
): void {
  if (curAction === undefined) {
    return;
  }

  if (curAction.command?.executable === Executable.CD) {
    const nextNode = goTo(curAction, curNode);
    const nextAction = nextActions.shift() as LineAction;
    buildFileTreeRec(nextAction, nextActions, nextNode);
  } else if (curAction.command?.executable === Executable.LS) {
    const filesInDir = parseLsOutput(nextActions, curNode);

    curNode.files = filesInDir.reduce(
      (map: Map<string, VirtualFile>, file: VirtualFile) => {
        map.set(file.fileName, file);
        return map;
      },
      new Map()
    );
    nextActions = nextActions.slice(filesInDir.length);
    const nextAction = nextActions.shift() as LineAction;
    buildFileTreeRec(nextAction, nextActions, curNode);
  } else {
    throw new Error(`Unhandled Executable in action`);
  }
}

function goTo(action: LineAction, curNode: VirtualFile): VirtualFile {
  const target = action.command?.arguments as string;
  if (target === '..') {
    return curNode.parent as VirtualFile;
  } else if (target === '/') {
    let node = curNode;
    while (node.parent) {
      node = node.parent;
    }
    return node as VirtualFile;
  } else {
    return curNode.files.get(target) as VirtualFile;
  }
}

function parseLsOutput(
  actions: LineAction[],
  curNode: VirtualFile
): VirtualFile[] {
  const files: VirtualFile[] = [];
  for (let i = 0; i < actions.length; i++) {
    const action = actions[i];
    if (action.command) {
      break;
    }
    files.push(convertToFile(action, curNode));
  }
  return files.sort((a, b) =>
    a.isDir === b.isDir
      ? a.fileName.localeCompare(b.fileName)
      : a.isDir
      ? 1
      : -1
  );
}

function convertToFile(
  lsOutput: LineAction,
  curNode: VirtualFile
): VirtualFile {
  const output = lsOutput.output as FileOutput;
  const fileSize = output.fileSize || 0;

  updateParentsFileSize(curNode, fileSize);
  return {
    fileName: output.fileName,
    files: new Map(),
    isDir: output.isDir,
    fileSize: fileSize,
    parent: curNode
  };
}

function updateParentsFileSize(
  curNode: VirtualFile,
  newFileSize: number
): void {
  let cur: VirtualFile | undefined = curNode;
  while (cur) {
    cur.fileSize += newFileSize;
    cur = cur.parent;
  }
}

const byteFormat = Intl.NumberFormat('en', {
  notation: 'compact',
  style: 'unit',
  unit: 'byte',
  unitDisplay: 'narrow'
});

function printTree(root: VirtualFile): void {
  new Intl.NumberFormat();
  console.log(
    `- ${root.fileName} (dir, sumSize=${byteFormat.format(root.fileSize)})`
  );
  printTreeRec(root, 0);
}

function printTreeRec(node: VirtualFile, indent: number): void {
  node.files.forEach((element) => {
    if (element.isDir) {
      console.log(
        `${' '.repeat(indent)} - ${
          element.fileName
        } (dir, sumSize=${byteFormat.format(element.fileSize)}`
      );
      printTreeRec(element, indent + 2);
    } else {
      console.log(
        `${' '.repeat(indent)} - ${
          element.fileName
        } (file, size=${byteFormat.format(element.fileSize)})`
      );
    }
  });
}

function findDirectoriesLessThan(
  root: VirtualFile,
  threshold: number
): VirtualFile[] {
  return findDirectories(
    root,
    threshold,
    (size, threshold) => size <= threshold
  );
}

function findDirectoriesGreaterThan(
  root: VirtualFile,
  threshold: number
): VirtualFile[] {
  return findDirectories(
    root,
    threshold,
    (size, threshold) => size >= threshold
  );
}

function findDirectories(
  root: VirtualFile,
  threshold: number,
  filterFunc: (size: number, threshold: number) => boolean
) {
  // We want to exlcude the root in the calculation
  const queue = [...root.files.values()].filter((file) => file.isDir);
  const result: VirtualFile[] = [];
  let element;
  while ((element = queue.shift())) {
    if (filterFunc(element.fileSize, threshold)) {
      result.push(element);
    }
    const newElements = [...element.files.values()].filter(
      (file) => file.isDir
    );
    queue.push(...newElements);
  }
  return result;
}

function findMinimalDirectoryToDelete(
  root: VirtualFile,
  needFreeSpace: number
): VirtualFile {
  const possibleDirectories = findDirectoriesGreaterThan(root, needFreeSpace);

  // Find the smalles possible directory
  return possibleDirectories.reduce(
    (curMin: VirtualFile, file: VirtualFile): VirtualFile => {
      return file.fileSize <= curMin.fileSize ? file : curMin;
    },
    root
  );
}

export { run };
