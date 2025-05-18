import { httpServer } from './http_server/index.js';
import { WebSocketServer } from 'ws';
import { register } from './register';

const HTTP_PORT = 8181;
const WEBSOCKET_PORT = 3000;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const webSocketServer = new WebSocketServer({ port: WEBSOCKET_PORT });

webSocketServer.on('connection', (webSocket) => {
    webSocket.on('message', (message: Buffer) => {
        try {
            const data = JSON.parse(message.toString());
            register(data, webSocket);
        } catch (err) {
            console.log(err)
        }
    });
    webSocket.on('close', () => {
        console.log('Disconnect');
    });
});
