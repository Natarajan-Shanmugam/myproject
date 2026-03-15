import User from "../models/user_details.model";
import { generateToken } from "../utils/jwt";
import bcrypt from "bcrypt";

export class AuthService {
    static async LoginUser(data: { email: string; password: string }) {

        const { email, password } = data;

        const user = await User.findOne({ where: { email }, raw: true });
        console.log('auth controller user: ', user)

        if (!user) {
            return { message: "Invalid credentials" };
        }

        let saved_pwd = user.password;
        if (!user.password) {
            const hashed = await bcrypt.hash(password, 10);
            const [affected, other] = await User.update({ password: hashed }, { where: { email: email }, returning: true });
            saved_pwd = other[0].password
        }

        const isMatch = await bcrypt.compare(password, saved_pwd);

        if (!isMatch) {
            return { message: "Invalid credentials match" };
        }

        const token = generateToken({
            id: user.id,
            email: user.email,
        });

        return { token };

    }
}