import WebSocket from 'ws';
import { usersDB } from './db/player-data-storage';
import { ConnectionTypeEnum } from './enums/connection-type.enum';
import { roomDB } from './db/room-data-storage';
import { IUser } from './interfaces/user.interface';

export const addUserToRoom = (object: IUser, socket: WebSocket) => {
    const data = JSON.parse(object.data);
    const room = roomDB.getRoom(data.indexRoom);
    const currentUser = usersDB.getUser(socket);
    const owner = room?.roomUsers?.at(0);
    const socketOwnerRoom = usersDB.socketsUsers.get(owner?.index);

    if (room && currentUser && owner && socketOwnerRoom) {
        if (socket === socketOwnerRoom) return;

        const { name, index } = currentUser.data;

        room?.roomUsers.push({ name, index });

        const checkCurrentRoom = roomDB.roomDB;
        const currentPlayerRoom = checkCurrentRoom.find((user) => user.idOwnerRoom === index);

        if (currentPlayerRoom) {
            roomDB.deleteRoom(currentPlayerRoom.roomId);
            usersDB.changeRoomId(name, 0);
        }

        roomDB.deleteRoom(data.indexRoom);
        updateUsersStore(name, data.indexRoom);
        updateUsersStore(owner.name, data.indexRoom);

        const usersInRoom = [socketOwnerRoom, socket];
        const idPlayers = [owner.index, index];
        const updateRooms = JSON.stringify(roomDB.roomDB);

        usersInRoom.forEach((userSocket, indx) => {
            userSocket?.send(parseData(ConnectionTypeEnum.CREATE_GAME, JSON.stringify({ idGame: data.indexRoom, idPlayer: idPlayers[indx] })));
        });

        usersDB.socketsUsers.forEach(user => {
            user.send(parseData(ConnectionTypeEnum.UPDATE_ROOM, updateRooms));
        });
    }
}

function parseData(type: ConnectionTypeEnum, data: string): string {
    return JSON.stringify({
        type,
        data,
        id: 0,
    });
}

function updateUsersStore(name: string, index: any) {
    usersDB.changeUserStatus(name, true, false, true);
    usersDB.changeUserGameId(name, index);
}
