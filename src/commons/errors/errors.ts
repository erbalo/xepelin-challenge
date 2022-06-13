import { NextFunction, Request, Response } from 'express';

export class ApiError {
    message?: string;
    status: number;
    at: Date;

    constructor(message?: string, status = 500, at: Date = new Date()) {
        this.message = message;
        this.status = status;
        this.at = at;
    }
}

export class NotFoundError extends Error {
    constructor(msg: string) {
        super(msg);

        Object.setPrototypeOf(this, NotFoundError.prototype);
        this.name = Error.name;
        Error.captureStackTrace(this);
    }
}

export const handleError = (err: NotFoundError | TypeError | Error, req: Request, res: Response, next: NextFunction) => {
    const error = new ApiError();
    error.status = 503;
    error.message = 'Service Unavailable';

    if (err instanceof NotFoundError) {
        error.status = 404;
        error.message = err.message;
    }

    res.status(error.status).send(error);
};
