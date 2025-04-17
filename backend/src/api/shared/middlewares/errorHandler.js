export const errorHandler = (err, req, res, next) => {
    console.error("Error:", err);
  
    if (err.status === 404) {
      return res.status(404).json({
        success: false,
        message: err.message || "Resource not found",
      });
    }
  
    return res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  };