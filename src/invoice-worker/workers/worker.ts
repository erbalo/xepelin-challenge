import { schedule, ScheduledTask, ScheduleOptions, validate } from 'node-cron';

export interface WorkerStatus {
    sucess: boolean;
    error?: Error;
}

export abstract class Worker {
    private scheduleTime: string;
    private options: ScheduleOptions = {
        scheduled: true,
    };
    private task: ScheduledTask;

    constructor(scheduleTime: string) {
        this.scheduleTime = scheduleTime;
        this.initScheduler();
    }

    private initScheduler() {
        const isJobValidated = validate(this.scheduleTime);

        if (isJobValidated) {
            this.task = schedule(this.scheduleTime, this.taskInitializer, this.options);
        }

        this.task.start();
    }

    abstract execute(): Promise<WorkerStatus>;

    taskInitializer = async () => {
        const worker: WorkerStatus = await this.execute();

        if (!worker.sucess) {
            worker.error = new Error('Error executing worker');
        }
    };
}
