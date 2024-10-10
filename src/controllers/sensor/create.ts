import express, { Express, Request, Response, NextFunction } from "express";
import { database } from "../../../database";

export const createEspData: Express = express();

createEspData.post("/", async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { espressifId, temperatura, umidade, userId } = req.body;

    if (!espressifId || !temperatura || !umidade || !userId) {
        return res.status(400).json({

            message: "Bad Request: espressifId, temperatura, umidade, userId are required!",

        });
    }

    try {

        const data = await database.sensor.create({
            data: {
                espressifId,
                temperatura,
                umidade,
                userId,
            },
        });
        res.status(200).json(data);

    } catch (error) {

        res.status(500).json(error);

    }
});

