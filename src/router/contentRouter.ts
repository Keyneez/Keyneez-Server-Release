import { Router } from "express";
import contentController from "../controller/contentController";

const router: Router = Router();

router.get("/", contentController.getAllContent);
router.get("/jelly", contentController.getJellyContent);

export default router ;