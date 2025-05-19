import { IWinners } from 'interfaces/winners.interface';
import WebSocket from 'ws';

const initialUserUpdatedState = {
    status: true,
    isOwnerRoom: false,
    isGame: false,
    idRoom: 0,
    idGame: 0,
    singlePlay: false,
}

class UsersDB {
    usersDB: Map<WebSocket, any> = new Map();
    userStorage: Map<string, any> = new Map();
    winners: IWinners[] = [];
    socketsUsers: Map<number, WebSocket> = new Map();

    id: number = 0;

    setUser(socket: WebSocket, user: any) {
        this.usersDB.set(socket, user);
        this.socketsUsers.set(user.data.index, socket);
        this.id++;
    }

    getUser(socket: WebSocket) {
        return this.usersDB.get(socket);
    }

    isAlreadyExisInStorage(name: string): boolean {
        return this.userStorage.has(name);
    }

    isAlreadyExistInDB(socket: WebSocket): boolean {
        return this.usersDB.has(socket);
    }

    setUserStorage(user: any) {
        this.userStorage.set(user.name, {
            ...user,
            ...initialUserUpdatedState,
        });
    }

    getUserStorage(name: string) {
        return this.userStorage.get(name);
    }

    changeUserStatus(name: string, status: boolean, isOwnerRoom = false, isGame = false) {
        const user = this.userStorage.get(name);
        this.userStorage.set(name, { ...user!, status, isOwnerRoom, isGame });
    }

    changeRoomId(name: string, roomId: number) {
        const user = this.userStorage.get(name);
        this.userStorage.set(name, { ...user!, roomId });
    }

    changeUserGameId(name: string, idGame: number) {
        const user = this.userStorage.get(name);
        this.userStorage.set(name, { ...user!, idGame });
    }
}

export const usersDB = new UsersDB();
