import { Router, Request, Response } from "express";
import { upload } from "../utils/fileupload";
import { authMiddleware } from "../auth/auth";
import { PropertiesController } from "../controller/properties.controller";

const properties_router = Router();

properties_router.post("/insert", authMiddleware, authMiddleware, PropertiesController.insert);
properties_router.delete("/remove/:property_id", authMiddleware, PropertiesController.remove);
properties_router.get("/list", authMiddleware, PropertiesController.list);
properties_router.get("/seed-data", authMiddleware, PropertiesController.SeedData);

properties_router.post("/file-upload", [authMiddleware, upload.array("files", 10)], PropertiesController.UploadFile);
properties_router.post("/get-signed-url", authMiddleware, PropertiesController.GetSignedURL);

properties_router.delete("/remove-image/:property_id/:file_upload_id", authMiddleware, PropertiesController.RemoveImage);

//Public API
properties_router.get("/list-public", PropertiesController.listPublic);
properties_router.get("/list-details-public/:property_id", authMiddleware, PropertiesController.ListDetailsPublic);

export default properties_router;
