import { Request, Response } from "express";
import {UserService}  from "../services/user.serive";

export class UserController {

  static async ListUser(req: Request, res: Response) {
    try {
      const user = await UserService.ListUsers();
      res.status(201).json(user);
    } catch (err) {
      res.status(400).json({ error: err });
    }
  }

}
