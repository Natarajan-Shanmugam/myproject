import User from "../models/user.model";

export class UserService {
    static async ListUsers() {
        console.log('@Controller UserController @Service ListUsers ')
        return await User.findAll();
    }
}