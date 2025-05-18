import { ConnectionTypeEnum } from './enums/connection-type.enum';
import { IUser } from './interfaces/user.interface';
import WebSocket from 'ws';

export const register = (user: IUser, socket: WebSocket) => {
    socket.send(parseData(ConnectionTypeEnum.REG, user?.data));
};

function parseData(type: ConnectionTypeEnum, data: string): string {
    return  JSON.stringify({
        type,
        data,
        id: 0,
    });
}