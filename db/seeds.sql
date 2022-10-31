INSERT INTO department(name)
VALUES('Engineering'),('Finance'),('Legal'),('Sales');

INSERT INTO role( title , salary , department_id )
VALUES('Sales Lead',100000,4),('Sales person',80000,4),('Lead Engineer',150000,1),('Software Engineer',120000,1),('Account Manager',160000,2),('Accountant',125000,2),('Legal Team Lead',250000,3),('Lawyer',190000,3);

INSERT INTO employee(first_name, last_name,role_id, manager_id)
VALUES("Abraham","Lincoln",1,null),('Mike','Tyson',2,1),('Leo','Messi',3,null),('Cristiano','Ronaldo',4,2),('Kanye','West',5,2),('Freddy','Mercury',6,3),('Jim','Morrison',7,null);

SELECT * FROM employee;
SELECT * FROM role;
SELECT * FROM department;
