# Project Management API

A personal project for managing users, projects, and tasks with user authentication.

## Overview

This project is a RESTful API built with Node.js, Express, and Prisma ORM. It includes user authentication and CRUD operations for managing users, projects, and tasks.

## Setup

1. **Install dependencies:**

   Ensure you have Node.js and npm installed on your machine. Then, in the root directory of the project, run:

   ```bash
   npm install
   ```

   This will install all the necessary packages listed in `package.json`.

2. **Configure environment variables:**

   Create a `.env` file in the root directory. This file should contain the necessary environment variables for the project. Here is an example of what might be included:

   ```plaintext
   PORT=3000
   API_URL=http://localhost:3000
   COOKIE_SECRET=your_cookie_secret
   JWT_SECRET=your_jwt_secret_key
   DATABASE_URL=your_database_url
   ```

   Replace the placeholder values with your actual configuration details.

3. **Run database migrations:**

   ```bash
   npx prisma migrate dev
   ```

4. **Run the project:**

   - **For development:**

     Use the following command to start the development server with hot-reloading:

     ```bash
     npm run dev
     ```

     This will use `nodemon` to automatically restart the server when file changes are detected.

   - **For production:**

     To run the project in a production environment, use:

     ```bash
     npm start
     ```

     This will start the server using `node`, without hot-reloading.

5. **Access the API:**

   Once the server is running, you can access the API at `http://localhost:3000` (or the port you specified in the `.env` file).

## API Endpoints

- **User Management:**

  - `POST /api/v1/user/signup` - Register a new user
  - `POST /api/v1/user/login` - Login a user
  - `POST /api/v1/user/logout` - Logout a user
  - `POST /api/v1/user/change-password` - Change user password
  - `GET /api/v1/user/check-cookie` - Check session cookie
  - `POST /api/v1/user/refresh-token` - Refresh access token
  - `GET /api/v1/user/profile` - Get user profile
  - `PUT /api/v1/user/edit-profile` - Edit user profile

- **Project Management:**

  - `POST /api/v1/project/create-project` - Create a new project
  - `GET /api/v1/project/projects` - Get all projects
  - `GET /api/v1/project/project/:id` - Get a project by ID
  - `PUT /api/v1/project/update-project/:id` - Update a project
  - `DELETE /api/v1/project/delete-project/:id` - Delete a project

- **Task Management:**

  - `POST /api/v1/task/create-task` - Create a new task
  - `GET /api/v1/task/:projectId/tasks` - Get all tasks for a project
  - `GET /api/v1/task/:projectId/task/:taskId` - Get a task by ID
  - `PUT /api/v1/task/update-task/:taskId` - Update a task
  - `DELETE /api/v1/task/:projectId/delete-task/:taskId` - Delete a task

## License

This project is for personal use only. All rights reserved.

## Contact

For questions or feedback, please contact [chanbangay@gmail.com](mailto:chanbangay@gmail.com).
# task-management-api
