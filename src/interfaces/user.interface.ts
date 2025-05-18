import { ConnectionTypeEnum } from "enums/connection-type.enum";

export interface IUser {
    id: number;
    data: string;
    connectionType: ConnectionTypeEnum,
}

export interface IUserFlexable extends IUser {
    [additionalField: string]: any;
}