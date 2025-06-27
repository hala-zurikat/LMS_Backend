# 📚 LMS Backend – Node.js & Express.js

This is the backend part of an **Online Learning Management System (LMS)** built as part of the Full-Stack Web Development track in the DigiSkills ICT Upskilling Programme. The backend provides a RESTful API to support course management, user authentication, enrollment, assignments, and more.

## 🚀 Features

* ✅ **RESTful API** with Express.js
* 🔐 **Google OAuth 2.0** authentication
* 🔑 Role-based access control (Admin, Instructor, Student)
* 🎓 Course & Enrollment Management (CRUD)
* 📊 Progress tracking & submissions
* 🧪 Integrated quizzes and assignments
* 🛠 PostgreSQL database integration

## 🧰 Tech Stack

* **Runtime**: Node.js
* **Framework**: Express.js
* **Authentication**: Google OAuth 2.0
* **Database**: PostgreSQL
* **ORM/Query Builder**: (e.g., Knex.js or Sequelize) *(if used)*
* **Validation**: Express middleware
* **Error Handling**: Centralized error handling & status codes
* **Version Control**: Git + GitHub

## 📁 Folder Structure

```
/server
├── controllers/     # Route handlers
├── middleware/      # Auth & role checks
├── models/          # DB queries or ORM models
├── routes/          # Express routes
├── config/          # DB and OAuth configs
├── utils/           # Helper functions
└── app.js           # Main app entry
```

## 📌 Key API Endpoints

| Method | Endpoint       | Description                  |
| ------ | -------------- | ---------------------------- |
| GET    | `/courses`     | List all courses             |
| POST   | `/courses`     | Instructor creates a course  |
| POST   | `/enroll`      | Enroll a student in a course |
| GET    | `/users/:id`   | Get user profile             |
| POST   | `/auth/google` | Google OAuth login           |

## 🔐 Authentication & Authorization

* Uses **OAuth 2.0 (Google)** for login.
* Middleware for role-based access:

  * `/admin/*` → Admin only
  * `/instructor/*` → Instructor only

## 🗄 Database Schema (PostgreSQL)

Main Tables:

* `Users`: id, name, email, role, etc.
* `Courses`: id, title, instructor\_id, etc.
* `Enrollments`: user\_id, course\_id, progress
* `Modules`, `Lessons`, `Assignments`, `Submissions`, `Quizzes`, `Notifications`

ERD and schema details are available in the full report.

## ⚙️ Setup & Run

```bash
# Install dependencies
npm install

# Configure environment variables (.env)
PORT=5000
DATABASE_URL=your_database_url
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_secret

# Run the server
npm run dev
```

## ✅ Minimum Requirements Met

* [x] 5+ REST API endpoints
* [x] Google OAuth login
* [x] Role-based access control
* [x] PostgreSQL integration with 3+ core tables
* [x] Clean and modular code structure

## 📌 Notes

* This repository only includes the **backend** code. The frontend (React.js) is hosted in a separate repository.
* Basic error handling and status codes (404, 500, etc.) implemented.
