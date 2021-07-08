import express from "express";
import {search, home} from "../controllers/videoController";
import {getJoin, login} from "../controllers/userContoroller";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.get("/join", getJoin);
rootRouter.get("/login", login);
rootRouter.get("/search", search);

export default rootRouter;