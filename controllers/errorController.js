const HandleGlobalError = (err, req, res, next) => {
  if (err.code === 11000) {
    return res.status(500).json({
      ok: false,
      status: 'error',
      message: 'duplicate key',
    });
  }
  return res.status(err?.statusCode || 400).json({
    ok: false,
    status: err.status,
    message: err.message,
    err,
  });
};
module.exports = HandleGlobalError;
