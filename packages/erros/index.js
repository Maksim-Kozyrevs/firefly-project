class appError extends Error {
  constructor(message, statusCode) {
    super(message),
    this.status = false,
    this.statusCode = statusCode,
    this.isOperational = true,
    Error.captureStackTrace(this, this.constructor)
  };
};



export default appError;