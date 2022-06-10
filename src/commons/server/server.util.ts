/* eslint-disable @typescript-eslint/no-explicit-any */
import { Server } from 'http';
import * as http from 'http';
import * as Logger from '../logger/logger';

const logger = Logger.getLogger(module);

type returnValue = number | string | boolean;

export const normalizePort = (value: number | string): returnValue => {
    const port: number = typeof value === 'string' ? parseInt(value) : value;
    if (isNaN(port)) return value;
    else if (port >= 0) return port;
    else return false;
};

export const onError = (_server: Server, serverPort: any) => {
    return (error: any): void => {
        const port = serverPort;
        if (error.syscall !== 'listen') throw error;
        const bind = typeof port === 'string' ? `pipe ${port}` : `port ${port}`;
        switch (error.code) {
            case 'EACCES':
                logger.error(`${bind} requieres elevated privileges`);
                process.exit(1);
                break;
            case 'EADDRINUSE':
                logger.error(`${bind} is already in use`);
                process.exit(1);
                break;
            default:
                throw error;
        }
    };
};

export const onListening = (server: http.Server) => {
    return (): void => {
        const address = server.address();
        const bind = typeof address === 'string' ? `pipe ${address}` : `port ${address?.port}`;
        logger.info(`Listening at ${bind}`);
    };
};
