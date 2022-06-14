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

export class DuplicatedError extends Error {
    constructor(msg: string) {
        super(msg);

        Object.setPrototypeOf(this, DuplicatedError.prototype);
        this.name = DuplicatedError.name;
        Error.captureStackTrace(this);
    }
}

export class NotFoundError extends Error {
    constructor(msg: string) {
        super(msg);

        Object.setPrototypeOf(this, NotFoundError.prototype);
        this.name = NotFoundError.name;
        Error.captureStackTrace(this);
    }
}

export class BadRequestError extends Error {
    constructor(msg: string) {
        super(msg);

        Object.setPrototypeOf(this, BadRequestError.prototype);
        this.name = BadRequestError.name;
        Error.captureStackTrace(this);
    }
}

export class ServerError extends Error {
    constructor(msg: string) {
        super(msg);

        Object.setPrototypeOf(this, ServerError.prototype);
        this.name = ServerError.name;
        Error.captureStackTrace(this);
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const handleError = (err: NotFoundError | BadRequestError | TypeError | Error, req: Request, res: Response, next: NextFunction) => {
    const error = new ApiError();
    error.status = 503;
    error.message = 'Service Unavailable';

    if (err instanceof NotFoundError) {
        error.status = 404;
        error.message = err.message;
    }

    if (err instanceof BadRequestError) {
        error.status = 400;
        error.message = err.message;
    }

    res.status(error.status).send(error);
    next(err);
};
