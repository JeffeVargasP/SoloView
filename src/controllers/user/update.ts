import express, { Express, Request, Response } from "express";
import { database } from "../../../database";
import { hashPassword } from "../../middleware/auth";

export const updateUser: Express = express();

updateUser.put("/", async (req: Request, res: Response): Promise<any> => {
    const { name, email, city, farm } = req.body;

    if ( !name || !email || !city || !farm ) {
        return res.status(400).json({
            message: "Bad Request: name, email, city, farm are required!",
        });
    }

    const findEmail = await database.user.findFirst({
        where: { email },
    });

    if (!findEmail) {
        return res.status(404).json({
            message: "User not found",
        });
    }

    const updateUser = await database.user.update({
        where: { email },
        data: {
            name,
            email,
            city,
            farm,
        }
    });

    res.status(200).json(updateUser);
});
