import express from 'express';
import HttpException from '../exceptions/HttpException';

function errorMiddleware(
  error: HttpException,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const status = error.status || 500;
  const message = error.message || 'server error';

  res.status(status).send({ status, message });
}

export default errorMiddleware;
