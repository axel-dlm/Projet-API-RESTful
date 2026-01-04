module.exports = (err, req, res, next) => {
  console.error('\n=== ERROR HANDLER ===');
  console.error('Message:', err.message);
  console.error('Stack:', err.stack);
  console.error('Path:', req.path);
  console.error('====================\n');
  if (res.headersSent) return next(err);
  res.status(500).json({ error: 'Internal error', message: err.message, path: req.path });
};
