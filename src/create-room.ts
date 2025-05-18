import WebSocket from 'ws';
import { usersDB } from './db/player-data-storage';
import { ConnectionTypeEnum } from './enums/connection-type.enum';
import { roomDB } from './db/room-data-storage';

export const createRoom = (_: unknown, socket: WebSocket) => {
    if (!usersDB.isAlreadyExisInDB(socket)) return;

    const user = usersDB.getUser(socket);

    if (!user) return;

    const roomId = roomDB.getRoomId();
    const room = updateRoom(roomId, user.data.name, user.data.index);
    const rooms = JSON.stringify(roomDB.roomDB);

    roomDB.createRoom(room, user.data.index);
    usersDB.changeUserStatus(user.data.name, true, true);
    usersDB.changeRoomId(user.data.name, roomId);

    usersDB.socketsUsers.forEach(user => {
        user.send(parseData(ConnectionTypeEnum.UPDATE_ROOM, rooms));
    });
};

function parseData(type: ConnectionTypeEnum, data: string): string {
    return JSON.stringify({
        type,
        data,
        id: 0,
    });
}

function updateRoom(roomId: number, name: string, index: number) {
    return {
        roomId,
        idOwnerRoom: index,
        roomUsers: [{ name, index }],
    };
};