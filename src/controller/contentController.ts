import { NextFunction, Request, Response } from "express";
import { rm, sc } from "../constants";
import { fail, success } from "../constants/response";
import contentService from "../service/contentService";


const getAllContent = async (req: Request, res: Response) => {
    const data = await contentService.getAllContent();

    //? 서버 내부 오류로 인한 조회 실패
    if (!data) {
      return res
        .status(sc.INTERNAL_SERVER_ERROR)
        .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
    }
  
    return res.status(sc.OK).send(success(sc.OK, rm.READ_ALL_CONTENTS_SUCCESS, data));
}   


const getJellyContent = async (req: Request, res: Response) => {
    const {user_pk} = req.body
    const data = await contentService.getJellyContent();

    //? 서버 내부 오류로 인한 조회 실패
    if (!data) {
      return res
        .status(sc.INTERNAL_SERVER_ERROR)
        .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
    }
  
    return res.status(sc.OK).send(success(sc.OK, rm.READ_CONTENT_SUCCESS, data));
}   

const contentController = {
    getAllContent,
    getJellyContent,
  };
  
  export default contentController;