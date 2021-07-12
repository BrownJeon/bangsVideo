import express from "express";
import {edit, finishGithubLogin, logout, remove, see, startGithubLogin} from "../controllers/userContoroller";

const userRouter = express.Router();

userRouter.get("/logout", logout);
userRouter.get("/edit", edit);
userRouter.get("/remove", remove);
userRouter.get("/auth/github/start", startGithubLogin);
userRouter.get("/auth/github/callback", finishGithubLogin);
userRouter.get("/:id", see);

export default userRouter;