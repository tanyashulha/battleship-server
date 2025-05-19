import { ConnectionTypeEnum } from "enums/connection-type.enum";

export interface IGeneral {
    id: number;
    data: string;
    type: ConnectionTypeEnum,
}