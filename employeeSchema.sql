DROP DATABASE IF EXISTS employeesDB;

CREATE DATABASE employeesDB;

USE employeesDB;

CREATE TABLE department(
    id INT AUTO_INCREMENT NOT NULL,
    dept_name VARCHAR(30) NOT NULL,
    -- budget INT,
    PRIMARY KEY(id)
);

CREATE TABLE roles(
    id INT AUTO_INCREMENT NOT NULL,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(department_id) REFERENCES department(id) ON DELETE CASCADE
);

CREATE TABLE employee(
    id INT AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT,
    PRIMARY KEY(id),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE CASCADE
);

--Create Manager table & hard code in managers
CREATE TABLE managers(
    id INT AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    PRIMARY KEY(id)
);
INSERT INTO managers (first_name, last_name) VALUES("Johnnie", "Bleu");
INSERT INTO managers (first_name, last_name) VALUES("Aurora", "Pemberton");
INSERT INTO managers (first_name, last_name) VALUES("Kevin", "Niel");
INSERT INTO managers (first_name, last_name) VALUES("Lexie", "May");



-- INNER JOIN returns role.title, role.salary, dep_name
SELECT roles.title, roles.salary, department.dept_name
FROM roles
INNER JOIN department
ON roles.department_id = department.id

-- INNER JOIN returns employee.first_name, employee.last_name, roles.title, and roles.salary
SELECT employee.first_name, employee.last_name, roles.title, roles.salary
FROM employee
INNER JOIN roles
ON employee.role_id = roles.id

-- INNER JOIN returns FIRST NAME, LAST NAME, TITLE, SALARY, AND DEPARTMENT
SELECT employee.first_name, employee.last_name, roles.title, roles.salary, department.dept_name
FROM department
INNER JOIN roles ON roles.department_id = department.id
INNER JOIN employee ON employee.role_id = roles.id

-- INNER JOIN will return NAME, TITLE, and SALARY from the Accounting department only
SELECT employee.first_name, employee.last_name, roles.title, roles.salary, department.dept_name
FROM department
INNER JOIN roles ON roles.department_id = department.id
INNER JOIN employee ON employee.role_id = roles.id
WHERE department.id = 1