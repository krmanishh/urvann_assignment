const asyncHandler = (requestHandlerFxn) => {
  return (req, res, next) => {
    Promise.resolve(requestHandlerFxn(req, res, next)).catch((err) => next(err))
  }
}


export {asyncHandler};

