# 🏫 School Vaccination Portal

A full-stack web application to manage student vaccinations across schools. Built with **React** (frontend), **Node.js/Express** (backend), and **PostgreSQL** (database).

---

## 📌 System Overview

This portal allows school coordinators to:

- Register students
- Schedule and update vaccination drives
- Register students to specific drives
- Generate detailed vaccination reports with filters and export options

---

## 🏗️ Application Architecture

```
React (Frontend)
   |
   |--- Axios HTTP Calls (REST)
   ↓
Node.js + Express (Backend)
   |
   |--- PostgreSQL via `pg` library
```

---

## ⚙️ Technologies Used

| Layer     | Stack               |
|-----------|---------------------|
| Frontend  | React + MUI         |
| Backend   | Node.js + Express   |
| Database  | PostgreSQL          |
| Extras    | Axios, XLSX, jsPDF  |

---

## 🚀 Local Setup Instructions

### 📁 Clone the repository

```bash
git clone 
cd School_Vaccination_Portal
```

---

### 🖥️ Frontend Setup

```bash
cd client
npm install
npm start
```

Runs on: [http://localhost:3000](http://localhost:3000)

---

### 🛠️ Backend Setup

```bash
cd server
npm install
```

Create a `.env` file with the following:
```env
PORT=8080
DATABASE_URL=postgresql://username:password@localhost:5432/vaccination_portal
```

Then, start the backend:

```bash
node index.js
```

Runs on: [http://localhost:8080](http://localhost:8080)

---

## 🔌 API Endpoints

### Vaccination Drives

| Method | Endpoint                   | Description                    |
|--------|----------------------------|--------------------------------|
| GET    | `/api/vaccinationDrive`    | Get all drives                 |
| POST   | `/api/vaccinationDrive`    | Create a new drive             |
| PUT    | `/api/vaccinationDrive/:id`| Update drive                   |
| DELETE | `/api/vaccinationDrive/:id`| Delete drive                   |

### Students

| Method | Endpoint               | Description             |
|--------|------------------------|-------------------------|
| GET    | `/api/students`        | Get all students        |
| POST   | `/api/students`        | Add a student           |
| DELETE | `/api/students/:id`    | Delete a student        |

### Registered Students

| Method | Endpoint                            | Description                         |
|--------|-------------------------------------|-------------------------------------|
| GET    | `/api/registeredStudents`           | Get all registered students         |
| POST   | `/api/registeredStudents`           | Register student to a drive         |
| DELETE | `/api/registeredStudents/:id`       | Unregister a student                |

### Reports

| Method | Endpoint           | Description                           |
|--------|--------------------|---------------------------------------|
| POST   | `/api/reports`     | Fetch vaccination report by vaccine   |

---

## 🧠 Assumptions

- Each student can be registered to only one vaccination drive at a time.
- Vaccination report filtering is done by vaccine name via dropdown.
- All data is assumed to be school-specific and not centralized.

---

## 🧾 Database Schema

### `students`
| Column         | Type      |
|----------------|-----------|
| id             | SERIAL PK |
| student_id     | TEXT      |
| name           | TEXT      |
| class          | TEXT      |
| age            | INTEGER   |
| gender         | TEXT      |

### `vaccination_drives`
| Column     | Type      |
|------------|-----------|
| id         | SERIAL PK |
| date       | DATE      |
| location   | TEXT      |

### `registered_students`
| Column         | Type      |
|----------------|-----------|
| id             | SERIAL PK |
| student_id     | INTEGER   |
| drive_id       | INTEGER   |

### `vaccination_records`
| Column           | Type      |
|------------------|-----------|
| id               | SERIAL PK |
| student_id       | TEXT      |
| student_name     | TEXT      |
| student_class    | TEXT      |
| drive_id         | INTEGER   |
| vaccinated_on    | DATE      |
| vaccine_name     | TEXT      |
| status           | TEXT      |

---

## 📄 License

MIT

---

## 🙋‍♂️ Author

Pranav Kanagal
