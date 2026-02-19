import { Request, Response } from "express";
import { PropertiesService } from "../services/properties.service";

export class PropertiesController {

    static async insert(req: Request, res: Response) {
        console.log('@PropertiesController @method insert');
        try {
            req.body.created_by = 1;
            req.body.updated_by = 1;
            const user = await PropertiesService.AddProperties(req.body);
            res.status(201).json(user);
        } catch (err) {
            res.status(400).json({ error: err });
        }
    }

    static async list(req: Request, res: Response) {
        console.log('@PropertiesController @method list');
        try {
            const user = await PropertiesService.ListProperties();
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
            const seed_type =  String(req.params.type);
            const user = await PropertiesService.SeedData(seed_type);
            res.status(201).json(user);
        } catch (err) {
            res.status(400).json({ error: err });
        }
    }
}
