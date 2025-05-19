import { ShipTypesEnum } from 'enums/ship-types.enum';

export interface IShipPosition {
    position: IPosition,
    direction: boolean,
    type: ShipTypesEnum,
    length: number,
}

export interface IPosition {
    x: number,
    y: number,
}