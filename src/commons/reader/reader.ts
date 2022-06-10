import { createReadStream } from 'fs';
import { createInterface } from 'readline';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type LineApplier = (line: string) => void;

export class Reader {
    private filePath: string;

    constructor(filePath: string) {
        this.filePath = filePath;
    }

    applyOnEachLine(applier: LineApplier) {
        const lineReader = createInterface({
            input: createReadStream(this.filePath),
        });

        lineReader.on('line', applier);
    }
}
