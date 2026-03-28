import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const register = Joi.object(
{
    firstname: Joi.string().required,
    surname: Joi.string().required,
    phone: Joi.string().required,
    email: Joi.string().required,
    password: Joi.string().required,
})

const login = Joi.object(
{
    email: Joi.string().required,
    password: Joi.string().required
})

export default { register, login };