import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

export class AuthController {

  static async login(req: Request, res: Response) {
    try {
      const user = await AuthService.LoginUser(req.body);
      res.status(201).json(user);
    } catch (err) {
      res.status(400).json({ error: err });
    }
  }

}
