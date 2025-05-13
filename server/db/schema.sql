-- students table
CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  student_id VARCHAR(50) UNIQUE NOT NULL,
  class VARCHAR(10),
  age INTEGER,
  gender VARCHAR(10),
  vaccinated VARCHAR(10),
);

-- vaccination_drives table
CREATE TABLE vaccination_drives (
  id SERIAL PRIMARY KEY,
  vaccine_name VARCHAR(100) NOT NULL,
  drive_date DATE NOT NULL,
  doses_available INTEGER NOT NULL,
  applicable_classes TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- vaccination_records table
CREATE TABLE vaccination_records (
  id SERIAL PRIMARY KEY,
  student_id VARCHAR(50) UNIQUE NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
  student_name VARCHAR(50),
  student_class VARCHAR (10),
  drive_id INTEGER REFERENCES vaccination_drives(id) ON DELETE CASCADE,
  vaccinated_on DATE,
  vaccine_name VARCHAR(100),
  status VARCHAR(20) CHECK (status IN ('Vaccinated', 'Not Vaccinated')),
  UNIQUE (student_id, drive_id) 
);

-- users table (for simulated auth)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(100), 
  role VARCHAR(20) DEFAULT 'Coordinator'
);

CREATE TABLE register_students (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  student_id VARCHAR(50) UNIQUE NOT NULL,
  class VARCHAR(10),
  vacc_drive_date DATE NOT NULL,
  vaccine_name VARCHAR(15)
);