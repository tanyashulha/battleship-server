export interface ILoginData {
    name: string;
    password: string;
}

export interface ILoginDataFlexable extends ILoginData {
    [additionalField: string]: any;
}