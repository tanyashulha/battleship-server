import { IGeneral } from 'interfaces/general.interface';
import { IShipPosition } from 'interfaces/ship-position.inteface';
import { roomDB } from './db/room-data-storage';
import { ConnectionTypeEnum } from './enums/connection-type.enum';
import { usersDB } from './db/player-data-storage';
import { parseData } from './utils/parse-data.utils';

export const locateShips = (object: IGeneral) => {
    const data = JSON.parse(object.data);

    const updatedShipsState = {
        ...data,
        ships: data.ships.map((s: IShipPosition) => ({ ...s, hitpoint: s.length })),
    };

    roomDB.setGameRoomData(data.gameId, updatedShipsState);

    const rooms = roomDB.getGameRoom(data.gameId)?.players;

    if (!rooms) return;

    rooms.forEach((player) => {
        const { indexPlayer, ships } = player;
        const socketUser = usersDB.getSocketUserById(indexPlayer);
        socketUser?.send(parseData(ConnectionTypeEnum.START_GAME, JSON.stringify({ ships, currentPlayerIndex: indexPlayer })));
        socketUser?.send(parseData(ConnectionTypeEnum.TURN, JSON.stringify({ currentPlayer: data.indexPlayer })));
    });
};