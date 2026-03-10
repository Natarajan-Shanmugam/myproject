import { Router, Request, Response } from "express";
import User from "../models/user_details.model";
import { AuthController } from "../controller/auth.controller";

const auth_router = Router();

auth_router.post("/login", AuthController.login);

export default auth_router;