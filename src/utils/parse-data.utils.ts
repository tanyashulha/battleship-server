import { ConnectionTypeEnum } from "enums/connection-type.enum";

export const parseData = (type: ConnectionTypeEnum, data: string): string => {
    return JSON.stringify({
        type,
        data,
        id: 0,
    });
}