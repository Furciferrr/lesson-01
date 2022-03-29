"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const utils_1 = require("../utils");
const data_1 = require("./../data");
const router = express_1.default.Router();
router.post("/", (req, res) => {
    const newBlogger = {
        id: (0, utils_1.getRandomNumber)(),
        name: req.body.name,
        youtubeUrl: req.body.youtubeUrl,
        posts: [],
    };
    data_1.bloggers.push(newBlogger);
    res.status(201).send(newBlogger);
});
router.get("/", (req, res) => {
    res.send(data_1.bloggers);
});
router.get("/:id", (req, res) => {
    const foundBlogger = data_1.bloggers.find((blogger) => blogger.id === +req.params.id);
    if (!foundBlogger) {
        return res.status(404);
    }
    res.send(foundBlogger);
});
exports.default = router;
