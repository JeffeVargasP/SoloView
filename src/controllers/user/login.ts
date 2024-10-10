import express, { Express, Request, Response } from "express";
import { generateToken, comparePassword } from "../../middleware/auth";
import { database } from "../../../database";

export const loginUser: Express = express();

loginUser.post("/", async (req: Request, res: Response): Promise<any> => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({
            message: "Bad Request: email, senha are required!",
        });
    }

    const user = await database.user.findFirst({
        where: { email },
    });


    if (!user) {
        return res.status(401).json({
            message: "User not found",
        });
    }

    const isPasswordValid = await comparePassword(senha, user.senha);

    if (!isPasswordValid) {
        res.status(401).json({
            message: "Password did not match",
        });
    }

    const token = generateToken(user.email);

    res.status(200).json({
        message: "Authentication successful",
        user: {
            id: user.id,
            email: user.email,
            nome: user.nome,
        },
        token: token,
    });

});
