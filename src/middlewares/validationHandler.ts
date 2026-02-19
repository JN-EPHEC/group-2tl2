import { Request, Response, NextFunction } from 'express';

export const checkIdParam = (req: Request, res: Response, next: NextFunction) => {

  const id = req.params.id as string;

  if (!id || !/^\d+$/.test(id)) {
    return res.status(400).json({ 
      error: "Bad Request: L'ID fourni doit être un nombre entier valide." 
    });
  }

  next();
};