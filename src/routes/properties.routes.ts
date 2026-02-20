import { Router, Request, Response } from "express";
import User from "../models/user_details.model";
import { authMiddleware } from "../auth/auth";
import { PropertiesController } from "../controller/properties.controller";

const properties_router = Router();

properties_router.post("/insert", authMiddleware,  PropertiesController.insert);
properties_router.delete("/remove/:property_id", authMiddleware,  PropertiesController.remove);
properties_router.get("/list", authMiddleware,  PropertiesController.list);
properties_router.get("/seed-data", authMiddleware,  PropertiesController.SeedData);

export default properties_router;
