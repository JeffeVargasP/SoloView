import express, { Express, Request, Response } from "express";
import { database } from "../../../database";
import { hashPassword } from "../../middleware/auth";

export const createUser: Express = express();

createUser.post("/", async (req: Request, res: Response): Promise<any> => {
    const { password, email, name } = req.body;

    if (!password || !email || !name) {
        return res.status(400).json({
            message: "Bad Request: password, email, name are required!",
        });
    }

    const findEmail = await database.user.findFirst({
        where: { email },
    });

    if (findEmail) {
        return res.status(409).json({
            message: "Email already registered",
        });
    }

    if (password.length < 6) {
        return res.status(400).json({
            message: "Password must be at least 6 characters",
        });
    }

    const hashedPasswd = await hashPassword(password);

    const createUser = await database.user.create({
        data: {
            name,
            email,
            password: hashedPasswd,
        }
    });

    res.status(201).json(createUser);
});
