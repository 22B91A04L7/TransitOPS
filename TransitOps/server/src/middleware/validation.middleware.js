import { sendFailure } from '../utils/apiResponse.js'

export const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const data = req[source]

    const result = schema.safeParse(data)

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors
      const messages = Object.entries(errors).flatMap(([field, msgs]) =>
        msgs.map((msg) => `${field}: ${msg}`)
      )

      return sendFailure(res, 'Validation failed', 400, { errors: messages })
    }

    req.validated = result.data
    next()
  }
}

export const validateBody = (schema) => validate(schema, 'body')
export const validateQuery = (schema) => validate(schema, 'query')
export const validateParams = (schema) => validate(schema, 'params')