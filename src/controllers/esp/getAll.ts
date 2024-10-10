import express, { Request, Response } from "express";
import { database } from "../../../database";

export const getEspData: express.Express = express();

getEspData.get("/", async (req: Request, res: Response) => {
    try {

        const result = await database.espressif.findMany();

        if (result.length === 0 || result === undefined) {
            res.status(404).json({ message: "No data found" });
        } else {
            res.status(200).json(result);
        }
    } catch (error) {
        res.status(500).json(error);
    }
});
