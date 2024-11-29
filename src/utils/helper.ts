// Custom error class
class CustomError extends Error {
  statusCode: number; // Status code
  constructor(statusCode: number, message: string, logError: boolean = false) {
    super(message); // Call the parent constructor with the message
    this.statusCode = statusCode; // Set the status code
    this.message = message; // Set the message
    this.name = this.constructor.name; // Set the name of the error

    // Optionally log errors
    if (logError) {
      console.error(`${this.name}: ${message}`);
    }
  }
}

export default CustomError; // Export the CustomError class
