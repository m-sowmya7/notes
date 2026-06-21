import { Request, Response } from 'express';
import { UserService } from '../services/userService';

export const getUser = async (req: Request, res: Response) => {
    try {
        const userId = req.header("x-user-id");

        if(!userId) {
            return res.status(400).json({ error: "Missing user id" });
        }

        const user = await UserService.findOrCreateUser(userId);

        res.json(user);
    }
    catch(error) {
        console.error("getUser error:", error);
        res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
    }
};