import { NextFunction, Request, Response } from "express";
import { rm, sc } from "../constants";
import { fail, success } from "../constants/response";
import contentService from "../service/contentService";

const authKakao = async (req:Request, res:Response) => {

}

const authApple = async (req:Request, res:Response) => {
    
}

const userController = {
    authKakao,
    authApple,
};
  
export default userController;