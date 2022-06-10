import app from './app';

import * as http from 'http';

import { ServerUtil } from './commons';
const server = http.createServer(app);

const PORT = process.env.SERVER_PORT || 8080;
const serverPort = ServerUtil.normalizePort(PORT);

(async () => {
    server.listen(serverPort);
    server.on('error', ServerUtil.onError(server, serverPort));
    server.on('listening', ServerUtil.onListening(server));
})();
