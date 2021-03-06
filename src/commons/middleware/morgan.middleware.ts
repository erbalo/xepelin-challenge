import morgan, { StreamOptions } from 'morgan';
import * as Logger from '../logger/logger';

const logger = Logger.getLogger(module);

const stream: StreamOptions = {
    write: message => logger.http(message.trim().trimEnd()),
};

const skip = () => {
    const env = process.env.NODE_ENV || 'development';
    return env != 'development';
};

export const loggerMorgan = morgan(':method :url :status :res[content-length]', { stream, skip });
