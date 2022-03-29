"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const data_1 = require("./../data");
const router = express_1.default.Router();
router.post("/", (req, res) => { });
router.get("/", (req, res) => {
    res.send(data_1.posts);
});
router.get("/:id", (req, res) => { });
exports.default = router;
