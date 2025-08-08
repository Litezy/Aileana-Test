const ServerError = (res, error) => {
    console.error("Server Error:", error);
    return res.status(500).json({
        status: "error",
        statusCode: 500,
        message: error?.message || "Internal Server Error",
    });
}

module.exports = ServerError;