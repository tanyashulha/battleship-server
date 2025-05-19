import { IRoomData } from "interfaces/room-data.interface";

class RoomDB {
    roomId: number = 0;
    roomDB: IRoomData[] = [];

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

    deleteRoom(idRoom: number) {
        this.roomDB = this.roomDB.filter((item) => item.roomId !== idRoom);
    }
}

export const roomDB = new RoomDB();
