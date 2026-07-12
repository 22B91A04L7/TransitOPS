import { body } from 'express-validator'

export const loginValidation = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Valid email is required'),

    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isString()
        .withMessage('Password must be a string')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
]