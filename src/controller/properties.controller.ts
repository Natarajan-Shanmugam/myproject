import { Request, Response } from "express";
import { PropertiesService } from "../services/properties.service";

export class PropertiesController {

    static async insert(req: Request, res: Response) {
        console.log('AddProperties req.body: ', req.body)
        try {
            req.body.property_id = Number(req.params.property_id);
            const user = await PropertiesService.AddProperties(req.body);
            res.status(201).json(user);
        } catch (err) {
            res.status(400).json({ error: err });
        }
    }

    static async list(req: Request, res: Response) {
        console.log('AddProperties req.body: ', req.body)
        try {
            const user = await PropertiesService.ListProperties();
            res.status(201).json(user);
        } catch (err) {
            res.status(400).json({ error: err });
        }
    }

    static async remove(req: Request, res: Response) {
        console.log('AddProperties req.body: ', req.params)
        try {
            const property_id = Number(req.params.property_id);
            const user = await PropertiesService.RemoveProperties(property_id);
            res.status(201).json(user);
        } catch (err) {
            res.status(400).json({ error: err });
        }
    }
}
