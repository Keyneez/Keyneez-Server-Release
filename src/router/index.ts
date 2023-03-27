import { Router } from "express";
import userRouter from "./userRouter"
import contentRouter from "./contentRouter";

const router: Router = Router();

router.use("/auth", userRouter);
router.use("/content", contentRouter);


export default router;
