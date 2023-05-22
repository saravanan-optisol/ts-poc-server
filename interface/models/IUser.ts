import { ObjectId } from "mongoose";

export interface IUser {
    id?: ObjectId;
    name: string;
    email: string;
    password: string;
    avator: string;
    date: Date;
    [x: string]: any;
}