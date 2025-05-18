import { ILoginDataFlexable } from 'interfaces/login-data.interface.js';
import { IUserFlexable } from 'interfaces/user.interface';
import WebSocket from 'ws';

class UsersDB {
    usersDB: Map<WebSocket, IUserFlexable> = new Map();
    userStorage: Map<string, ILoginDataFlexable> = new Map();

    id: number = 0;

    setUser(socket: WebSocket, user: IUserFlexable) {
        this.usersDB.set(socket, user);
        this.id++;
    }

    getUser(socket: WebSocket) {
        return this.usersDB.get(socket);
    }

    isAlreadyExist(name: string): boolean {
        return this.userStorage.has(name);
    }

    getUserID(): number {
        return this.id;
    }

    setUserStorage(user: ILoginDataFlexable) {
        this.userStorage.set(user.name, user);

        console.log(this.userStorage)
        console.log(this.usersDB)
    }
}

export const usersDB = new UsersDB();
