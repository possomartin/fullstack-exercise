import { Request, Response, NextFunction } from "express";

const isAuth = async (req: Request, res: Response, next: NextFunction) => {
  if (req.session.isAuth && req.session.user?.admin) {
    next();
  } else {
    res.status(401).json({ success: false, msg: "No Authorization" });
  }
};

export default isAuth;
