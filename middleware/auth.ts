import { NextFunction } from "express";
import { IRequest } from "../interface/type";
import jwt from 'jsonwebtoken';


const auth = () => {
  return (req: IRequest, res: Response, next: NextFunction) => {
    
  //get token from header
  const token = req.header('x-auth-token');

  //check its token
  if (!token) {
    return res
      .status(401)  
      .json({ msg: '<midware/auth.js>user not autherized' });
  }

  //verify the token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: '<midware/auth.js>Token not valid' });
  }
  }
};

export default auth;