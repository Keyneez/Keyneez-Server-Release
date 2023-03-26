import { Router } from "express";
import { userController } from "../controller";

const router: Router = Router();

router.get("/kakao", userController.authKakao);
router.get("/apple", userController.authApple);

export default router ;