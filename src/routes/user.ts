import { Router } from "express";
import User from "../models/user";
import { Sequelize, DataTypes } from 'sequelize';

const router = Router();

router.post("/", async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
});

router.get("/", async (_, res) => {
  const users = await User.findAll();
  res.json(users);
});


router.post("/update", async (_, res) => {

  try{

  const user_res = await User.create({
    name: 'natty',
    email: 'natty@gmail.com',
  });

  res.json(user_res);
} catch (error){
  console.log('error: ', error)
}
});

export default router;
