CREATE DATABASE cheating_exam;
USE cheating_exam;

-- ตารางผู้ใช้
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,   -- ควรเก็บ hashed password
  name VARCHAR(50) NOT NULL,
  lname VARCHAR(50) NOT NULL,
  email VARCHAR(50) NOT NULL UNIQUE,
  role ENUM('admin','user') NOT NULL DEFAULT 'user'
);

-- ตารางห้องเรียน
CREATE TABLE classroom (
  classroom_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  room_id VARCHAR(50),
  user_id INT,   -- คนสร้างห้อง
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- ตารางข้อสอบ
CREATE TABLE exam (
  exam_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  classroom_id INT,
  FOREIGN KEY (classroom_id) REFERENCES classroom(classroom_id)
);

-- ตารางคำถาม
CREATE TABLE question (
  question_id INT AUTO_INCREMENT PRIMARY KEY,
  exam_id INT,
  title TEXT NOT NULL,   -- ข้อความคำถาม
  FOREIGN KEY (exam_id) REFERENCES exam(exam_id)
);

-- ตารางตัวเลือกคำตอบ
CREATE TABLE answer (
  answer_id INT AUTO_INCREMENT PRIMARY KEY,
  question_id INT NOT NULL,
  choice_letter VARCHAR(5),         -- เช่น A, B, C...
  choice_text TEXT NOT NULL,         -- ข้อความตัวเลือก เช่น "4", "True"
  is_correct BOOLEAN NOT NULL,
  FOREIGN KEY (question_id) REFERENCES question(question_id)
);

-- ตารางคำตอบนักเรียน
CREATE TABLE student_answer (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  exam_id INT NOT NULL,
  question_id INT NOT NULL,
  answer_id INT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (exam_id) REFERENCES exam(exam_id),
  FOREIGN KEY (question_id) REFERENCES question(question_id),
  FOREIGN KEY (answer_id) REFERENCES answer(answer_id)
);

-- ตารางเก็บผลสอบรวมของนักเรียน
CREATE TABLE exam_result (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  exam_id INT NOT NULL,
  total_score INT NOT NULL,
  submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (exam_id) REFERENCES exam(exam_id)
);

CREATE TABLE cheating_log (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  exam_id INT,
  event_type VARCHAR(100),
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  detail TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (exam_id) REFERENCES exam(exam_id) ON DELETE CASCADE
);


ALTER TABLE classroom ADD CONSTRAINT unique_room_id UNIQUE (room_id);
ALTER TABLE classroom ADD COLUMN description TEXT;

CREATE TABLE classroom_member (
  id INT AUTO_INCREMENT PRIMARY KEY,
  classroom_id INT,
  user_id INT,
  FOREIGN KEY (classroom_id) REFERENCES classroom(classroom_id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

ALTER TABLE exam ADD COLUMN is_open BOOLEAN DEFAULT FALSE;
ALTER TABLE question ADD COLUMN image VARCHAR(255);
