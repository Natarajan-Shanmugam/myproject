import { Router, Request, Response } from "express";
import User from "../models/user";
import { Sequelize, DataTypes } from 'sequelize';
import { authMiddleware } from "../auth/auth";
import { login } from "../controller/auth.controller";
import { verifyToken, JwtPayload } from "../utils/jwt";

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

const router = Router();

router.post("/", async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
});

router.get("/", authMiddleware, async (req: AuthRequest, res) => {

  console.log("Logged user:", req.user);

  const users = await User.findAll({ where: { email: req.user?.email }, raw: true });
  res.json(users);
});

router.post("/login", login);

router.post("/update", async (_, res) => {


  try {
    const user_res = await User.create({
      name: 'test',
      email: 'test@gmail.com',
    });

    res.json(user_res);
  } catch (error) {
    console.log('error: ', error)
  }
});

export default router;
