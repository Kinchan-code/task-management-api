import winston from "winston";

// Configure winston
export const logger = winston.createLogger({
  level: "info", // Define the logging level
  format: winston.format.json(), // Define the logging format
  transports: [
    new winston.transports.File({ filename: "error.log" }), // Define the error log file
    new winston.transports.Console({ format: winston.format.simple() }), // Define the console transport
  ],
});
