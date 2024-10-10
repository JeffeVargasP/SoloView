import express, { Express, Request, Response } from 'express';
import { database } from '../../../database';

export const findOne: Express = express();

findOne.get('', async (req: Request, res: Response): Promise<any> => {

    const id = parseInt(req.params.id);

    const user = await database.user.findUnique({
        where: { id }
    });

    if (!user) {
        return res.status(404).json({ message: 'Users not found' });
    }

    res.status(200).json(user);

});