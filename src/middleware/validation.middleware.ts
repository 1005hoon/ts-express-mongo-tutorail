import express from 'express';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import HttpException from '../exceptions/HttpException';

function validationmiddleware<T>(type: any): express.RequestHandler {
  return async (req, res, next) => {
    const errors: ValidationError[] = await validate(
      plainToClass(type, req.body),
      { skipMissingProperties: true }
    );
    if (errors.length > 0) {
      const message = errors
        .map((error: ValidationError) => Object.values(error.constraints as {}))
        .join(', ');
      next(new HttpException(400, message));
    } else {
      next();
    }
  };
}

export default validationmiddleware;
