import express, { Express, Request, Response } from "express";
import { database } from "../../../database";
import { hashPassword } from "../../middleware/auth";

export const createUser: Express = express();

createUser.post("/", async (req: Request, res: Response): Promise<any> => {
    const { senha, email, nome, cidade, fazenda } = req.body;

    if (!senha || !email || !nome || !cidade || !fazenda) {
        return res.status(400).json({
            message: "Bad Request: senha, email, nome, cidade, fazenda are required!",
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

    if (senha.length < 6) {
        return res.status(400).json({
            message: "Password must be at least 6 characters",
        });
    }

    const hashedPasswd = await hashPassword(senha);

    const createUser = await database.user.create({
        data: {
            nome,
            email,
            senha: hashedPasswd,
            cidade,
            fazenda,
        }
    });

    res.status(201).json(createUser);
});
