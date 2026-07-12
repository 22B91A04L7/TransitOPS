export const sendSuccess = (res, data = {}, statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        data,
    })
}

export const sendFailure = (res, message = 'Request failed', statusCode = 400) => {
    return res.status(statusCode).json({
        success: false,
        message,
    })
}
