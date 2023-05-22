import { ObjectId } from "mongoose";

export interface IProduct {
    [x: string]: any;
    category: string;
    name: string;
    productName: string;
    brand: string;
    prize: string;
    description: string;
    information: string;
    imgsrc: string;
    reviews: IReview[];
    date: Date;
}

export interface IReview {
    id?: ObjectId;
    user?: ObjectId;
    rating: number;
    comment?: string;
    name: string;
    avatar: string;
    date?: Date;
}