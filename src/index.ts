import { httpServer } from './http_server/index';
import { WebSocketServer } from 'ws';
import { register } from './register';
import { ConnectionTypeEnum } from './enums/connection-type.enum';
import { createRoom } from './create-room';

const HTTP_PORT = 8181;
const WEBSOCKET_PORT = 3000;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const webSocketServer = new WebSocketServer({ port: WEBSOCKET_PORT });

webSocketServer.on('connection', (webSocket) => {
    webSocket.on('message', (message: Buffer) => {
        try {
            const data = JSON.parse(message.toString());
            switch (data?.type) {
                case ConnectionTypeEnum.REG:
                    register(data, webSocket);
                    break;
                case ConnectionTypeEnum.CREATE_ROOM:
                    createRoom(data, webSocket);
                    break;
            }
        } catch (err) {
            console.log(err)
        }
    });
    webSocket.on('close', () => {
        console.log('Disconnect');
    });
});
