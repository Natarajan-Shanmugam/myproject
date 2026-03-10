import { Request, Response } from "express";
import { PropertiesService } from "../services/properties.service";

interface reqUser extends Request {
    user?: {
        id?: number
    }
}

export class PropertiesController {

    static async insert(req: reqUser, res: Response) {
        console.log('@PropertiesController @method insert');
        try {

            console.log('req user_id ', req?.user?.id)

            req.body.created_by = req?.user?.id;
            req.body.updated_by = req?.user?.id;
            const user = await PropertiesService.AddProperties(req.body);
            res.status(201).json(user);
        } catch (err) {
            res.status(400).json({ error: err });
        }
    }

    static async list(req: reqUser, res: Response) {
        console.log('@PropertiesController @method list');
        console.log('req user_id ', req?.user?.id)
        try {
            const user_id: any = req?.user?.id;
            const user = await PropertiesService.ListProperties(user_id, false);
            res.status(201).json(user);
        } catch (err) {
            res.status(400).json({ error: err });
        }
    }

    static async listPublic(req: reqUser, res: Response) {
        console.log('@PropertiesController @method listPublic');
        console.log('req user_id ', req?.user?.id)
        console.log('req is_local_admin:  ', (req?.query?.is_local_admin))
        try {

            const user_id: any = req?.user?.id;
            let user;
            if ((req?.query?.is_local_admin === 'true')) {
                user = await PropertiesService.ListProperties(2, false);
            } else {
                user = await PropertiesService.ListProperties(user_id, true);
            }

            res.status(201).json(user);
        } catch (err) {
            res.status(400).json({ error: err });
        }
    }

    static async remove(req: Request, res: Response) {
        console.log('@PropertiesController @method remove');
        try {
            const property_id = Number(req.params.property_id);
            const user = await PropertiesService.RemoveProperties(property_id);
            res.status(201).json(user);
        } catch (err) {
            res.status(400).json({ error: err });
        }
    }

    static async SeedData(req: Request, res: Response) {
        console.log('@PropertiesController @method SeedData');
        try {
            const user = await PropertiesService.SeedData();
            res.status(201).json(user);
        } catch (err) {
            res.status(400).json({ error: err });
        }
    }

    static async UploadFile(req: Request, res: Response) {
        console.log('@PropertiesController @method UploadFile req.file: ', req.file);

        if (!Number(req.body.property_id)) {
            return { message: "Missing field: property_id" }
        }

        try {

            const [input, files] = [req.body, req.files]

            const user = await PropertiesService.UploadFile(input, files);
            res.status(201).json(user);
        } catch (err) {
            res.status(400).json({ error: err });
        }
    }

    static async RemoveImage(req: Request, res: Response) {
        console.log('@PropertiesController @method remove');
        try {
            const { property_id, file_upload_id } = req.params;
            const user = await PropertiesService.RemoveImage(Number(property_id), Number(file_upload_id));
            res.status(201).json(user);
        } catch (err) {
            res.status(400).json({ error: err });
        }
    }

    static async ListDetailsPublic(req: reqUser, res: Response) {
        console.log('@PropertiesController @method ListDetailsPublic');
        if (!Number(req.params.property_id)) {
            return { status: false, message: "Missing Property ID" }
        }
        try {
            const property_id = Number(req.params.property_id);
            const user_id: any = (req?.query?.is_local_admin === 'true') ? 2 : null;
            const user = await PropertiesService.ListDetailsPublic(property_id, user_id);
            res.status(201).json(user);
        } catch (err) {
            res.status(400).json({ error: err });
        }
    }

    static async GetSignedURL(req: Request, res: Response) {
        console.log('@PropertiesController @method GetSignedURL');
        try {
            const file_key = req.body.file_key;
            const user = await PropertiesService.GetSignedURL(file_key);
            res.status(201).json(user);
        } catch (err) {
            res.status(400).json({ error: err });
        }
    }

    static async propertyLocationsDropdown(req: Request, res: Response) {
        console.log('@PropertiesController @method propertyLocationsDropdown');
        try {
            const user = await PropertiesService.propertyLocationsDropdown();
            res.status(201).json(user);
        } catch (err) {
            res.status(400).json({ error: err });
        }
    }

    static async propertyStatusDropdown(req: Request, res: Response) {
        console.log('@PropertiesController @method propertyStatusDropdown');
        try {
            const user = await PropertiesService.propertyStatusDropdown();
            res.status(201).json(user);
        } catch (err) {
            res.status(400).json({ error: err });
        }
    }

    static async propertyFilter(req: Request, res: Response) {
        console.log('@PropertiesController @method propertyFilter');
        try {
            let input = req.body;
            input.user_id = (req?.query?.is_local_admin === 'true') ? 2 : null;
            const user = await PropertiesService.propertyFilter(input);
            res.status(201).json(user);
        } catch (err) {
            res.status(400).json({ error: err });
        }
    }
}
