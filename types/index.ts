export interface IFileDrop {
  onDrop?: (params?: any) => void;
}

export class WorkerBuilder extends Worker {
  constructor(worker: any) {
    const code = worker.toString();
    const blob = new Blob([`(${code})()`]);
    super(URL.createObjectURL(blob));
  }
}
export interface TextFile {
  name: string;
  size: number;
  type: string;
  errors: Array<string>;
}

export interface IFileComputed {
  topThreeWords: [string, number][];
  countWord: number;
  textFile: TextFile;
}
