import express from "express";
import {search, home} from "../controllers/videoController";
import {getJoin, getLogin, postJoin, postLogin} from "../controllers/userContoroller";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.route("/join").get(getJoin).post(postJoin);
rootRouter.route("/login").get(getLogin).post(postLogin);
rootRouter.get("/search", search);

export default rootRouter;