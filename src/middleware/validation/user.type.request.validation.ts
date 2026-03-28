import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const create = Joi.object(
{
    name: Joi.string().required,
    abbr: Joi.string().required,
    description: Joi.string().required
})

const update = Joi.object(
{
    id: Joi.string().required,
    name: Joi.string().required,
    abbr: Joi.string().required,
    description: Joi.string().required
})

export default { create, update };