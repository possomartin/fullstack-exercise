import express, { Router, Request, Response } from "express";
import userService from "../db/services/userService.js";
import { User } from "../db/types/user.js";

const userRouter: Router = express.Router();
const { register, checkUser } = userService;

userRouter.post("/register", async (req: Request, res: Response) => {
  const user: Omit<User, "id"> = {
    username: req.body.username,
    password: req.body.password,
    admin: false,
  };
  const registerUser = await register(user);

  if (!!registerUser) {
    res.status(201).json({ success: true, msg: "User created successfully" });
  } else {
    res.status(400).json({
      success: false,
      msg: "An error occurred while processing your transaction.",
    });
  }
});

userRouter.post("/register", async (req: Request, res: Response) => {
  const user: Omit<User, "id"> = {
    username: req.body.username,
    password: req.body.password,
    admin: false,
  };
  const foundUser = await checkUser(user);

  if (!!foundUser) {
    req.session.user = foundUser;
    req.session.isAuth = true;
    res.status(200).json({ success: true, msg: "you are logged in!" });
  } else {
    res.status(400).json({ success: false, msg: "Couldn't logged you in :(" });
  }
});

userRouter.post("/logout", (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) throw err;
    res.status(200).json({ msg: "Successfully Logout" });
  });
});

export default userRouter;
