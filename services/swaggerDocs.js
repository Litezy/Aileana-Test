const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Ailena Test API",
      version: "1.0.0",
      description: "API documentation for Ailena Backend Assessment",
    },
     components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
    servers: [
      {
        url: "http://localhost:5000",
      },
    ],
  },
  apis: ["./routes/*.js"], // Adjust the path as needed
};

module.exports = { swaggerOptions };
