// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  let error = { ...err };
  error.message = err.message;

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    const message = `${field.charAt(0).toUpperCase() + field.slice(1)} '${value}' already exists`;
    
    error = {
      message,
      statusCode: 400
    };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    error = {
      message: messages[0],
      statusCode: 400
    };
  }

  // Mongoose cast error (invalid ID)
  if (err.name === 'CastError') {
    error = {
      message: `Resource not found with id of ${err.value}`,
      statusCode: 404
    };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error'
  });
};

module.exports = errorHandler; 