import express, { Express, Request, Response } from 'express';
import { database } from '../../../database';

export const findAll: Express = express();

findAll.get('', async (req: Request, res: Response): Promise<any> => {

    const users = await database.user.findMany();

    if (!users) {
        return res.status(404).json({ message: 'Users not found' });
    }

    res.status(200).json(users);

});