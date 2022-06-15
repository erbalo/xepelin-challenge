import { createReadStream, existsSync } from 'fs';
import { createInterface } from 'readline';
import { NotFoundError } from '../errors/errors';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type LineApplier = (line: string, index: number) => void;

export class Reader {
    private fileName: string;
    private filePath: string;

    constructor(directory: string, fileName: string) {
        this.fileName = fileName;
        this.filePath = `${directory}/${this.fileName}`;
    }

    applyOnEachLine(applier: LineApplier, skipHeaders = true) {
        if (!existsSync(this.filePath)) {
            throw new NotFoundError(`The file ${this.fileName} not exists`);
        }

        const input = createReadStream(this.filePath, { start: 10 });
        const lineReader = createInterface({ input });

        const data: string[] = [];

        lineReader.on('line', (line: string) => {
            data.push(line);
        });

        lineReader.on('close', () => {
            let index = skipHeaders ? 1 : 0;

            for (index; index < data.length; index++) {
                applier(data[index], index);
            }
        });
    }
}
