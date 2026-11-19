CREATE DATABASE IF NOT EXISTS StudentManagementDB;
USE StudentManagementDB;

CREATE TABLE IF NOT EXISTS Students (
  StudentID   INT AUTO_INCREMENT PRIMARY KEY,
  FirstName   VARCHAR(50)  NOT NULL,
  LastName    VARCHAR(50)  NOT NULL,
  Gender      ENUM('Male','Female') NOT NULL,
  DateOfBirth DATE         NOT NULL,
  Class       VARCHAR(30)  NOT NULL,
  PhoneNumber VARCHAR(20)  NOT NULL,
  Email       VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS Users (
  UserID   INT AUTO_INCREMENT PRIMARY KEY,
  UserName VARCHAR(50)  NOT NULL UNIQUE,
  Password VARCHAR(255) NOT NULL,
  Role     ENUM('admin','teacher') NOT NULL DEFAULT 'teacher'
);
