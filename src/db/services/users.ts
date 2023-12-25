import bcrypt from "bcrypt";
import dbConnection from "../../config/connection.js";
import express, { Router, Request, Response } from "express";
import { User } from "../types/user.js";

const userRouter: Router = express.Router();

userRouter.post("/register", async (req: Request, res: Response) => {
  try {
    const client = await dbConnection.connect();
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const user: Partial<User> = {
      username: req.body.username,
      password: hashedPassword,
      admin: false,
    };
    await client.query(
      'INSERT INTO public."User"(username, password, admin) VALUES ($1, $2, $3) Returning *',
      [user.username, user.password, user.admin]
    );
    client.release();
    res.status(201).json({ success: true, msg: "User created successfully" });
  } catch {
    res.status(400).json({
      success: false,
      msg: "An error occurred while processing your transaction.",
    });
  }
});

userRouter.post("/login", async (req: Request, res: Response) => {
  const client = await dbConnection.connect();

  const query = await client.query(
    'Select * from public."User" where username=$1',
    [req.body.username]
  );
  const foundUsername = query.rows[0];

  if (!!foundUsername) {
    if (await bcrypt.compare(req.body.password, foundUsername.password)) {
      req.session.user = foundUsername;
      req.session.isAuth = true;
      res.status(200).json({ success: true, msg: "you are logged in!" });
    } else {
      res.status(400).json({ success: false, msg: "Wrong Password" });
    }
  } else {
    return res
      .status(404)
      .json({ success: false, msg: "Cannot find username" });
  }

  client.release();
  try {
  } catch {
    res.status(400).json({
      success: false,
      msg: "An error occurred while processing your transaction.",
    });
  }
});

userRouter.post("/logout", (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) throw err;
    res.status(200).json({ msg: "Successfully Logout" });
  });
});

export default userRouter;
