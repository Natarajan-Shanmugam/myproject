import { Router, Request, Response } from "express";
import User from "../models/user_details.model";
import { authMiddleware } from "../auth/auth";
import { UserController } from "../controller/user.controller";

const user_router = Router();

user_router.get("/list", authMiddleware,  UserController.ListUser);

export default user_router;
