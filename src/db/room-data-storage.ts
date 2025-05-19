import { IRoomData } from "interfaces/room-data.interface";
import { IRooms } from "interfaces/rooms.interface";

class RoomDB {
    roomId: number = 0;
    roomDB: IRoomData[] = [];

    rooms: Map<number, IRooms> = new Map();

    createRoom(room: IRoomData, index: number) {
        const checkUser = this.checkUser(index);

        if (!checkUser) {
            this.roomDB.push(room);
            this.roomId++;
        }
    }

    getRoom(roomId: number) {
        return this.roomDB.find(room => room.roomId === roomId);
    }

    getRoomId() {
        return this.roomId;
    }

    checkUser(indexPlayer: number) {
        const checkPlayerCreate = this.roomDB.reduce((acc: boolean[], val) => {
            if (val.roomUsers.find((userData) => userData.index === indexPlayer)) {
                acc.push(true);
                return acc;
            }
            acc.push(false);
            return acc;
        }, []);
        return checkPlayerCreate.some(c => c);
    }

    deleteRoom(roomId: number) {
        this.roomDB = this.roomDB.filter((item) => item.roomId !== roomId);
    }

    setGameRoomData(roomId: number, updatedShipsState: any) {
        const { fieldMap, points } = this.createGameField(updatedShipsState.ships);
        const { gameId, indexPlayer, ships } = updatedShipsState;
        const dataShip = { gameId, indexPlayer, fieldMap, points, ships };

        if (this.rooms.has(roomId)) {
            const room = this.rooms.get(roomId)!;
            const { players } = room;
            players.push(dataShip);
            this.rooms.set(roomId, room);
            return;
        }

        this.rooms.set(roomId, { players: [dataShip] });
    }

    getGameRoom(roomId: number) {
        return this.rooms.get(roomId);
    }

    generateMap() {
        const rowsLength = 10;
        const columnsLegth = 10;

        let fieldMap: any[] = [];

        for (let i = 0; i < columnsLegth; i += 1) {
            const column = [];

            for (let j = 0; j < rowsLength; j += 1) {
                column.push({
                    type: 'empty',
                    length: 0,
                    direction: false,
                    positionX: j,
                    positionY: i,
                    truePositionX: j,
                    truePositionY: i,
                    point: 0,
                    shoot: false,
                });
            }
            fieldMap.push(column);
        }

        return fieldMap;
    }

    createGameField(ships: any) {
        const fieldMap = this.generateMap();
        let points = 0;

        ships.forEach((ship: any) => {
            const { position, direction, length, point } = ship;
            const { x, y } = position;
            points += point;

            for (let i = 0; i < length; i += 1) {
                const ship = {
                    type: 'ship',
                    length,
                    direction,
                    positionX: x,
                    positionY: y,
                    truePositionX: direction ? x : x + i,
                    truePositionY: direction ? y + i : y,
                    point,
                    shoot: false,
                };
                if (direction) {
                    fieldMap[y + i]![x] = ship;
                } else {
                    fieldMap[y]![x + i] = ship;
                }
            }
        });

        return { fieldMap, points };
    };
}

export const roomDB = new RoomDB();
