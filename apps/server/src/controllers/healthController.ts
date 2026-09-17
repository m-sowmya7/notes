import { Request, Response } from 'express';

export const getHealth = (_req: Request, res: Response) => {
    const start = process.hrtime.bigint();

    const uptime = process.uptime();
    const timestamp = new Date().toISOString();

    const durationMs = Number(process.hrtime.bigint() - start) / 1e6;

    res.set('Cache-Control', 'no-store');
    res.status(200).json({
        status: 'ok',
        uptime,
        timestamp,
        responseTime: `${durationMs.toFixed(3)}ms`,
    });
};
