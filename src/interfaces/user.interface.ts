import { ConnectionTypeEnum } from "enums/connection-type.enum";

export interface IUser {
    id: number;
    data: string;
    type: ConnectionTypeEnum,
}