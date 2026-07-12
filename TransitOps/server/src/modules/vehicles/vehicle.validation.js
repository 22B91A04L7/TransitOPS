import { body, param } from 'express-validator'
import { FUEL_TYPE_LIST, VEHICLE_STATUS_LIST } from '../../constants/vehicleStatus.js'

export const vehicleIdValidation = [
    param('id')
        .isUUID()
        .withMessage('Valid vehicle id is required'),
]

const optionalVehicleFields = [
    body('vin')
        .optional({ values: 'null' })
        .trim()
        .isLength({ max: 50 })
        .withMessage('VIN must be 50 characters or fewer'),

    body('color')
        .optional({ values: 'null' })
        .trim()
        .isLength({ max: 50 })
        .withMessage('Color must be 50 characters or fewer'),

    body('status')
        .optional()
        .isIn(VEHICLE_STATUS_LIST)
        .withMessage(`Status must be one of: ${VEHICLE_STATUS_LIST.join(', ')}`),

    body('odometerReading')
        .optional({ values: 'null' })
        .isInt({ min: 0 })
        .withMessage('Odometer reading must be zero or greater'),

    body('fuelCapacityLiters')
        .optional({ values: 'null' })
        .isFloat({ min: 0 })
        .withMessage('Fuel capacity must be zero or greater'),

    body('fuelEfficiencyKmpl')
        .optional({ values: 'null' })
        .isFloat({ min: 0 })
        .withMessage('Fuel efficiency must be zero or greater'),

    body('purchaseDate')
        .optional({ values: 'null' })
        .isISO8601()
        .withMessage('Purchase date must be a valid date'),

    body('purchasePrice')
        .optional({ values: 'null' })
        .isFloat({ min: 0 })
        .withMessage('Purchase price must be zero or greater'),

    body('insuranceExpiry')
        .optional({ values: 'null' })
        .isISO8601()
        .withMessage('Insurance expiry must be a valid date'),

    body('registrationExpiry')
        .optional({ values: 'null' })
        .isISO8601()
        .withMessage('Registration expiry must be a valid date'),

    body('notes')
        .optional({ values: 'null' })
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Notes must be 1000 characters or fewer'),
]

export const createVehicleValidation = [
    body('plateNumber')
        .trim()
        .notEmpty()
        .withMessage('Plate number is required')
        .isLength({ max: 20 })
        .withMessage('Plate number must be 20 characters or fewer'),

    body('make')
        .trim()
        .notEmpty()
        .withMessage('Make is required')
        .isLength({ max: 100 })
        .withMessage('Make must be 100 characters or fewer'),

    body('model')
        .trim()
        .notEmpty()
        .withMessage('Model is required')
        .isLength({ max: 100 })
        .withMessage('Model must be 100 characters or fewer'),

    body('year')
        .isInt({ min: 1900, max: 2100 })
        .withMessage('Year is required and must be between 1900 and 2100'),

    body('fuelType')
        .notEmpty()
        .withMessage('Fuel type is required')
        .isIn(FUEL_TYPE_LIST)
        .withMessage(`Fuel type must be one of: ${FUEL_TYPE_LIST.join(', ')}`),

    ...optionalVehicleFields,
]

export const updateVehicleValidation = [
    ...vehicleIdValidation,

    body('plateNumber')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Plate number cannot be empty')
        .isLength({ max: 20 })
        .withMessage('Plate number must be 20 characters or fewer'),

    body('make')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Make cannot be empty')
        .isLength({ max: 100 })
        .withMessage('Make must be 100 characters or fewer'),

    body('model')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Model cannot be empty')
        .isLength({ max: 100 })
        .withMessage('Model must be 100 characters or fewer'),

    body('year')
        .optional({ values: 'null' })
        .isInt({ min: 1900, max: 2100 })
        .withMessage('Year must be between 1900 and 2100'),

    body('fuelType')
        .optional()
        .isIn(FUEL_TYPE_LIST)
        .withMessage(`Fuel type must be one of: ${FUEL_TYPE_LIST.join(', ')}`),

    ...optionalVehicleFields,
]
