# Freelance Marketplace Server

This is the backend server for the **Freelance Marketplace** project. It provides RESTful APIs to manage jobs, users, tasks, and reviews. Built with **Node.js**, **Express**, and **MongoDB**.

## Live Server

You can access the live server here:  
[https://freelance-marketplace-server-1.onrender.com](https://freelance-marketplace-server-1.onrender.com)


---

## Features

- Add, update, and delete jobs
- Accept jobs and track their status
- User profile management
- Submit and fetch reviews
- Assign tasks to freelancers
- Fetch tasks by freelancer email
- CORS enabled for frontend integration

---

## Tech Stack

- Node.js
- Express.js
- MongoDB Atlas
- dotenv (environment variables)
- CORS

---

## API Endpoints

### Jobs
- `GET /AllJobs` — Fetch all jobs
- `POST /addjobs` — Add a new job
- `GET /AllJobs/:id` — Get a single job by ID
- `PUT /AllJobs/:id/accept` — Accept a job
- `GET /my-add-job/:email` — Get jobs added by a specific user
- `DELETE /my-added-jobs/:id` — Delete a job
- `PUT /my-added-jobs/:id/accept` — Update job details

### Users
- `PUT /users/:email` — Create or update a user (upsert)
- `GET /users/:email` — Get a user by email (excludes password)
- `PUT /update-profile/:email` — Update a user's profile (name, image)

### Tasks
- `POST /my-task-collection` — Assign a task to a freelancer
- `GET /my-task-collection/:email` — Get tasks assigned to a freelancer
- `DELETE /my-task/:id` — Delete a task

### Reviews
- `POST /reviews` — Submit a review
- `GET /getTopReviews` — Fetch all reviews


