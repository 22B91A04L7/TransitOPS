import { body } from 'express-validator'

export const updateProfileValidation = [
    body('fullName')
        .trim()
        .notEmpty()
        .withMessage('Full name is required')
        .isLength({ max: 120 })
        .withMessage('Full name must be 120 characters or fewer'),
]
