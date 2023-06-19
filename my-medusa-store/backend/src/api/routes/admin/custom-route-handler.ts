import { Request, Response } from 'express';

export default async (req: Request, res: Response): Promise<void> => {
  res.send('hello world with ts');
};