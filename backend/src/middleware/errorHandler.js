export const errorHandler = (err, req, res, next) => {
  console.error('[API Error Handler]:', err);

  // Detect Neo4j / CognoDB connection issues
  const isDbError = err.code === 'ServiceUnavailable' || 
                    err.code === 'SessionExpired' || 
                    err.message?.includes('Failed to connect') ||
                    err.message?.includes('Could not perform discovery') ||
                    err.message?.includes('COGNODB');

  if (isDbError) {
    return res.status(503).json({
      error: 'Database Connection Error',
      message: 'Unable to connect to CognoDB Cloud database instance.',
      details: 'Please ensure your COGNODB_URI, COGNODB_USERNAME, and COGNODB_PASSWORD environment variables are properly configured in backend/.env',
      code: err.code || 'COGNODB_UNAVAILABLE'
    });
  }

  res.status(err.status || 500).json({
    error: err.name || 'InternalServerError',
    message: err.message || 'An unexpected server error occurred.',
    code: err.code || 'INTERNAL_ERROR'
  });
};

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
