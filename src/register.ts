import { ILoginData } from 'interfaces/login-data.interface';
import { ConnectionTypeEnum } from './enums/connection-type.enum';
import { IUser } from './interfaces/user.interface';
import { usersDB } from './db/player-data-storage';
import WebSocket from 'ws';
import { roomDB } from './db/room-data-storage';

export const register = (user: IUser, socket: WebSocket) => {
    const data = JSON.parse(user.data) as ILoginData;

    if (data) {
        const isAlreadyExisInStorage = usersDB.isAlreadyExisInStorage(data.name);
        const newData = isAlreadyExisInStorage
            ? generateIfAlreadyExists(data, socket)
            : generateNew(data, socket);

        usersDB.setUser(socket, newData);
        socket.send(parseData(ConnectionTypeEnum.REG, JSON.stringify(newData?.data)));
        socket.send(parseData(ConnectionTypeEnum.UPDATE_ROOM, JSON.stringify(roomDB?.roomDB)));
        socket.send(parseData(ConnectionTypeEnum.UPDATE_WINNERS, JSON.stringify(usersDB?.winners)));
    }
};

function parseData(type: ConnectionTypeEnum, data: string): string {
    return JSON.stringify({
        type,
        data,
        id: 0,
    });
}

function generateIfAlreadyExists(data: ILoginData, socket: WebSocket) {
    const initialObj = { password: data.password, name: data.name, index: usersDB.id };
    const storageUser = usersDB.getUserStorage(data.name)!;
    let user = { ...initialObj, error: false, errorText: '' };

    if (storageUser.password !== data.password) {
        user = { ...initialObj, error: true, errorText: 'This username is already registeredt' };
    }

    if (storageUser.status) {
        user = { ...initialObj, error: true, errorText: 'User is already in the game' };
    }

    if (user.error) {
        socket.send(parseData(ConnectionTypeEnum.REG, JSON.stringify(user)));
        return null;
    }

    usersDB.changeUserStatus(data.name, true);

    return {
        type: ConnectionTypeEnum.REG,
        data: user,
        socket,
        id: 0,
    };
}

function generateNew(data: ILoginData, socket: WebSocket) {
    usersDB.setUserStorage({ ...data, id: usersDB.id  });
    const minimumLength: number = 5;

    const initialObj = { password: data.password, name: data.name, index: usersDB.id };

    const user = data.password.length < minimumLength || data.name.length < minimumLength
        ? { ...initialObj, error: true, errorText: 'Allowed more than 4 characters'}
        : { ...initialObj, error: false, errorText: ''};

    if (user.error) {
        socket.send(parseData(ConnectionTypeEnum.REG, JSON.stringify(user)));
        return null;
    }

    usersDB.setUserStorage(user);

    return {
        type: ConnectionTypeEnum.REG,
        data: user,
        socket,
        id: 0,
    };
}