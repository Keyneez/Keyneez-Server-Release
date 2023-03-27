import { Prisma, PrismaClient } from "@prisma/client";
import axios, { Axios } from "axios";
import { NextFunction, Request, Response } from "express";
import session, { Cookie } from "express-session";
import { env } from "process";
import { rm, sc } from "../constants";
import { fail, success } from "../constants/response";
import contentService from "../service/contentService";

const prisma = new PrismaClient();


//* 인가 코드 확인
const authKakao = async (req: Request, res: Response) => {
    const session = req.session;
    const {code} = req.query;
    const authToken = await axios.post('https://kauth.kakao.com/oauth/token', {}, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        params:{
            grant_type: 'authorization_code',
            client_id: env.KAKAO_REST_API_KEY,
            code,
            redirect_uri: env.REDIRECT_URI_LOCAL
        }
    });

    const authInfo = await axios.post('https://kapi.kakao.com/v2/user/me', {}, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            'Authorization': 'Bearer ' + authToken.data.access_token
        }
    });

    // 회원 가입된 유저인 지 체크하고 아니라면 회원가입 페이지로 redirect
    const data = authInfo.data;
    const row = await prisma.user.findFirst({
        where: {
            sns_pk : data.id,
            sns_type : "kakao",
        }
    })

    if (row) {
        // 회원가입된 유저
        session.userId = row.sns_pk;
        session.save(() => { });
        res.redirect('http://localhost:3000');
        return;
    } 
    res.redirect('http://localhost:3000/auth/signup?token=' + (data.properties && data.properties.nickname ? '&name=' + encodeURIComponent(data.properties.nickname) : ''));
}

const authApple = async (req:Request, res:Response) => {
    
}

const userController = {
    authKakao,
    authApple,
};
  
export default userController;