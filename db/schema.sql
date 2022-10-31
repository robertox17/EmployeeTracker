DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) NOT NULL
);

CREATE TABLE role (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) UNIQUE NOT NULL,
     salary DECIMAL NOT NULL,
     department_id INT NOT NULL,
     INDEX dep_ind (department_id),
    FOREIGN KEY (department_id)
    REFERENCES department(id)
    ON DELETE CASCADE
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY ,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
     role_id INT UNSIGNED NOT NULL,
     manager_id INT NULL,
    FOREIGN KEY (role_id)
    REFERENCES role(id)
    ON DELETE SET NULL,
        FOREIGN KEY (manager_id)
    REFERENCES employee(id)
    ON DELETE SET NULL
);




