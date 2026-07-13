/**
 * errorMiddleware.js
 * Centralised Express error handler — must be the LAST middleware
 * registered in server.js (app.use(errorMiddleware)).
 */
export const errorMiddleware = (err, _req, res, _next) => {
  // CORS errors surfaced from the cors() middleware
  if (err.message && err.message.startsWith('CORS:')) {
    return res.status(403).json({ success: false, message: err.message });
  }

  const statusCode = err.statusCode || err.status || 500;
  const message =
    process.env.NODE_ENV === 'production' && statusCode === 500
      ? 'Internal server error. Please try again later.'
      : err.message || 'Something went wrong.';

  console.error(`[${new Date().toISOString()}] ERROR ${statusCode}:`, err);

  return res.status(statusCode).json({ success: false, message });
};
