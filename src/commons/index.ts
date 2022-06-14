import type { NextFunction, Request, RequestHandler, Response } from 'express';

export * from './errors/errors';

export * as Logger from './logger/logger';
export * as ServerUtil from './server/server.util';
export * as Middleware from './middleware/morgan.middleware';

export { Reader, LineApplier } from './reader/reader';
export { RabbitConnection, RabbitHandler } from './rabbitmq/rabbit';

export abstract class Mapper<D, E> {
    abstract fromDto(dto: D): E;
    abstract fromEntity(entity: E): D;

    fromEntities(entities: E[]): D[] {
        return entities.map(this.fromEntity);
    }

    fromDtos(dtos: D[]): E[] {
        return dtos.map(this.fromDto);
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
//export const asyncHandler = (fn: any) => (req: Request, res: Response, next: NextFunction) => Promise.resolve(fn(req, res, next)).catch(next);

export const asyncHandler = (fn: RequestHandler) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);
