import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt";
import User from "../models/user";
import { where } from "sequelize";

console.log('generateToken ', generateToken)

export const login = async (req: Request, res: Response) => {

    console.log('auth controller req.body: ', req.body)

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email }, raw: true });
    console.log('auth controller user: ', user)

    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    let saved_pwd = user.password;
    if (!user.password) {
        const hashed = await bcrypt.hash(password, 10);
        const [affected, other] = await User.update({ password: hashed }, { where: { email: email }, returning: true });

        console.log('affected ', affected);
        console.log('other ', other);

        saved_pwd = other[0].password
    }

    const isMatch = await bcrypt.compare(password, saved_pwd);

    if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials match" });
    }

    const token = generateToken({
        id: user.id,
        email: user.email,
    });

    console.log('token ', token);

    return res.json({ token });
};
