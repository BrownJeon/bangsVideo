import express from "express";
import {
    logout,
    getEdit,
    postEdit,
    getChangePassword,
    postChangePassword,
    finishGithubLogin,
    startGithubLogin,
    see
} from "../controllers/userContoroller";
import {protectorMiddleware, publicOnlyMiddleware} from "../middlewares";

const userRouter = express.Router();

userRouter.get("/logout", protectorMiddleware, logout);
userRouter.route("/edit").all(protectorMiddleware).get(getEdit).post(postEdit);
userRouter
    .route("/change-password")
    .all(protectorMiddleware)
    .get(getChangePassword)
    .post(postChangePassword);
userRouter.get("/auth/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/auth/github/callback", publicOnlyMiddleware, finishGithubLogin);
userRouter.get("/:id", see);

export default userRouter;