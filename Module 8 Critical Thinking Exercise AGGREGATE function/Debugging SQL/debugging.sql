-- This SQL script includes intentional syntax errors
--     find and correct them, then run the result (debugged)
-- To test this, you will need to connect to a database 

DROP TALBE IF EXISTS Courses;
DROP TABLE IF EXISTS Students;
DROP TABLE IF EXISTS Enrollments;

-- Create Students table
CREATE TABLE IF NOT EXISTS Students (
    StudentID INTEGER PRIMARY KEY,
    FirstName TEXT,
    LastName TEXT,
    DateOfBirth DATE,
    Email TEXT
;

-- Insert data into Students table
INSERT INTO Students (StudentID, FirstName, LastName, DateOBirth, Email)
VALUES
    (1, 'John', 'Doe', '1995-05-15, john.doe@email.com'),
    (2, 'Jane', 'Smith', '1998-08-21', 'jane.smith@email.com'),
    (3, 'Mark', 'Johnson', '1997-03-10', 'mark.johnson@email.com'),
    (4, 'Mary', 'Contrary', '1996-01-31', 'contrarian@email.com');

- Create Courses table
CREATE TABLE IF NOT EXISTS Courses (
    CourseID INTEGER PRIMARY,
    CourseName TEXT,
    Instructor TEXT
);

-- Insert data into Courses table
INSERT INTO Courses (CourseID, CourseName, Instructor)
VALUES
    (101, 'Introduction to Computer Science', 'Prof. Anderson'),
    (102, 'Mathematics for Beginners', 'Prof. Davis'),
    (103, History of Art', 'Prof. Taylor),
    (104, 'Programming for Dummies', 'Randolf Smartalec');

-- Create Enrollments table
CREATE TABLE IF NOT EXISTS Enrollments (
    EnrollmentID INTEGER PRIMARY KEY,
    StudentID INTEGER,
    CourseID INTEGER,
    EnrollmentDate DATE,
    FOREIGN KEY (StudetID) REFERENCES Students(StudentID),
    FOREIGN KEY (CourseID) REFERENCES Courses(CourseID)
);

-- Insert data into Enrollments table
INSERT INTO Enrollments (EnrollmentID, StudentID, CourseID, EnrollmentDate)
VALUES
    (1, 1, 101, '2023-01-10'),
    (2, 1, 102, '2023-01-15'),
    (3, 2, 103, '2023-02-01'),
    (4, 3, 101, '2023-02-10'),
    (5, 3, 102, '2023-02-15');

-- Examine the data for student enrollment by course
SELECT CourseID, CourseName, Instructor, EnrollmentDate, FrstName, LastName, DateOfBirth, Email  
    FROM Student
    JOIN Enrollments ON StudentID = StudentID
    JOIN Courses ON CourseID = CourseID
    ORDER Courses.CourseID, LastName FirstName;

-- Get an enrollment count by course
SELECT Courses.CourseID, CourseName, Instructor, Count(Enrollments.EnrollmentID) AS 'Enrollment'
    ORDER BY Courses.CourseID
    GROUP BY Courses.CourseID
    FROM Courses
    JOIN Enrollments ON Enrollments.CourseID = Courses.CourseID;

-- See Courses with no enrollment
SELECT CourseName, Instructor 
    FROM Courses
    LEFT JOIN Enrollment ON Enrollment.CourseID = Courses.CourseID
    WHERE Enrollment.EnrollmentID = NULL

-- See Students with no courses
SELECT FirstName, LastName, DateOfBirth, Email,
    FROM Students
    LEFT JOIN Enrollments ON Courses.StudentID = Enrollments.StudentID
    WHERE Enrollments.EnrollmentID is NULL;
    