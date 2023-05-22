import { ObjectId } from "mongoose";
import { IProduct } from "./IProduct";


export interface IProfile {
  user: ObjectId;
  location: string;
  mobile: number;
  address: string;
  cart: ICart[];
  orders?: IOrder[];
  product?: IProduct | IProduct[];
}

interface ICart {
  product: ObjectId;
  name: string;
  imgsrc: string;
  prize: number;
  date: Date;  
}


interface IOrder {
    product: ObjectId;
    date: Date;  
  }