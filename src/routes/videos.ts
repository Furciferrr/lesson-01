import express from "express";
import { ioc } from "../IocContainer";
import { IVideosController } from "../interfaces";
import { TYPES } from "../IocTypes";

const router = express.Router();


const videosController = ioc.get<IVideosController>(TYPES.VideosController);

router.get("/", videosController.getVideos.bind(videosController));

router.get("/:id", videosController.getVideoById.bind(videosController));

router.post("/", videosController.createVideo.bind(videosController));

router.delete("/:id", videosController.deleteVideoById.bind(videosController));

router.put("/:id", videosController.updateVideoById.bind(videosController));

export default router;
