import { ILoginData } from 'interfaces/login-data.interface';
import { ConnectionTypeEnum } from './enums/connection-type.enum';
import { IUser, IUserFlexable } from './interfaces/user.interface';
import { usersDB } from './db/player-data-storage';
import WebSocket from 'ws';

export const register = (user: IUser, socket: WebSocket) => {
    const data = JSON.parse(user.data) as ILoginData;
    if (data) {
        const newData = generateUserObj(data, socket) as IUserFlexable;
        usersDB.setUser(socket, newData);
        socket.send(parseData(ConnectionTypeEnum.REG, JSON.stringify(newData.data)));
    }
};

function parseData(type: ConnectionTypeEnum, data: string): string {
    return JSON.stringify({
        type,
        data,
        id: 0,
    });
}

function generateUserObj(data: ILoginData, socket: WebSocket): any {
    const id = usersDB.getUserID();
    usersDB.setUserStorage({ ...data, id  });

    return {
        type: ConnectionTypeEnum.REG,
        data: {
            ...data,
            id,
        },
        socket,
        id: 0,
    };
};