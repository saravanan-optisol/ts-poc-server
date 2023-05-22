import { Request } from "express";
import { ObjectId } from "mongoose";
export type ReqPayload = {
    user: IUser;
}

export type IRequest = Request & IUser & RequestParams

// type IUser = { user: User };

interface IUser {
    user: { id: ObjectId}
}

interface IParams {
    r_id?: ObjectId;
    p_id?: ObjectId;
}

interface RequestParams {
    params: IParams;
}