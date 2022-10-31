// TODO: Include packages needed for this application
const inquirer = require('inquirer');
const mysql = require('mysql2');
const consoleTables = require('console.table');



// const { start } = require('repl');


let department = [];
let role = [];
let employees = [];

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    //port: 3010,
    password: '',
    database: 'employee_db'
  },
  console.log(`Connected to the employee_db database.`)
);

db.connect((err) => {
  if (err) throw err;
  console.log('sql connected');

  start();
});

function start() {
  inquirer
    .prompt([
      {
        type: 'list',
        message: 'What would you like to do?',
        name: 'start',
        choices: ['View','Add','Update Employee','Quit'],

      }
    ]).then((res) => {
      switch (res.start) {
        case 'View':
          view();
          break;
        case 'Add':
          add();
          break;
        case 'Update Employee':
          UpdateEmployee();
          break;
        case 'Quit':
         console.log('Goodbye');
          break;
        default:
          console.log('default')

      }
    })
}
//view function set
function view() {
  inquirer
  .prompt([
    {
      type: 'list',
      message: 'What would you like to do?',
      name: 'view',
      choices: ['View All Employees','View By Department','view by role']

    }
  ]).then(res =>{
    switch(res.view){
      case 'View All Employees':
        ViewAllEmployees();
        break;
      case 'View By Department':
        viewByDepartment();
        break;
      case 'view by role':
        ViewAllRoles()
    }
  });
};

function ViewAllEmployees() {
  db.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;", (err, data) => {
    if (err) return err;

    console.log('\n');
    console.table(data);

    start();

  });
};
function ViewAllRoles() {
  db.promise().query(
    "SELECT * FROM role "
  )
    .then(([rows]) => {
      console.log("\n");
      console.table(rows);
    })
    .then(() => start())
};
function viewByDepartment(){
  db.promise().query(
    "SELECT * FROM department "
  )
    .then(([rows]) => {
      console.log("\n");
      console.table(rows);
    })
    .then(() => start())
};
//add function set 
function add() {
  inquirer
  .prompt([
    {
      type: 'list',
      message: 'What would you like to do?',
      name: 'add',
      choices: ['add Employees','add Department','add Role']

    }
  ]).then(res =>{
    switch(res.add){
      case 'add Employees':
        addEmployee();
        break;
      case 'add Department':
        addDepartment();
        break;
      case 'add Role':
        AddRole()
    }
  });
};
function addEmployee() {
  inquirer
    .prompt([
      {
        name: "first_name",
        message: "What is the employee's first name?"
      },
      {
        name: "last_name",
        message: "What is the employee's last name?"
      }
    ])
    .then(res => {
      let foreName = res.first_name;
      let surName = res.last_name;

      db.promise().query('SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id;')
        .then(([rows]) => {

          console.log(rows)
          const roleOptions = rows.map(({ id, title }) => ({
            value: id,
            name: title
          }));

          inquirer.prompt({
            type: "list",
            name: "roleId",
            message: "What is the employee's role?",
            choices: roleOptions
          })
            .then(res => {
              let roleId = res.roleId;

              db.promise().query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;"
              )
                .then(([rows]) => {
                  const managerChoices = rows.map(({ id, first_name, last_name }) => ({
                    name: `${first_name} ${last_name}`,
                    value: id
                  }));

                  inquirer.prompt({
                    type: "list",
                    name: "managerId",
                    message: "Who is the employee's manager?",
                    choices: managerChoices
                  })
                    .then(res => {
                      let employee = {
                        first_name: foreName,
                        last_name: surName,
                        manager_id: res.managerId,
                        role_id: roleId,
                      }

                      db.promise().query("INSERT INTO employee SET ?", employee);
                    })
                    .then(() => console.log(
                      `Added ${foreName} ${surName} to the table`
                    ))
                    .then(() => start())
                })
            })
        })
    })
};
function AddRole() {
  db.promise().query(
    "SELECT department.id, department.name FROM department;")
    .then(([rows]) => {
      const optForDeprt = rows.map(({ id, name }) => ({
        name: name,
        value: id
      }))
    
  inquirer
    .prompt([
      {
        name: "title",
        message: "What is the name of the role?"
      },
      {
        name: "salary",
        message: "What is the salary of the role?"
      },
      {
        type: "list",
        name: "department_id",
        message: "Which department does the role belong to?",
        choices: optForDeprt
      }
    ])
    .then(role => {
      db.promise().query("INSERT INTO role SET ?", role)
        .then(() => console.log(`Added ${role.title} to the database`))
        .then(() => start());
    })
  })
}
function addDepartment(){
  inquirer
  .prompt([
    {
      name: "name",
      message: "What is the name of the department?"
    }
  ])
    .then(department => {
      db.promise().query("INSERT INTO department SET ?", department)
        .then(() => console.log(`Added ${department.department} to the database`))
        .then(() => start())
    })
};

//update function set 
function UpdateEmployee() {
  inquirer
  .prompt([
    {
      type: 'list',
      message: 'What would you like to do?',
      name: 'updateEmp',
      choices: ['update Employees']

    }
  ]).then(res =>{
    switch(res.updateEmp){
      case 'update Employees':
        UpdateEmployeeRole();
        break;
    }
  });
};
function UpdateEmployeeRole() {
  db.promise().query(
    "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;"
  )
    .then(([rows]) => {
      const empRole = rows.map(({ id, first_name, last_name }) => ({
        value: id,
        name: `${first_name} ${last_name}`
      }));

      inquirer
        .prompt([
          {
            type: "list",
            name: "empRole",
            message: "Which employee's role do you want to update?",
            choices: empRole
          }
        ])
        .then((res) => {
          let empRole = res.empRole;
          db.promise().query('SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id;')
            .then(([rows]) => {
              const roleChoices = rows.map(({ id, title }) => ({
                name: title,
                value: id
              }));
              inquirer
                .prompt([
                  {
                    type: "list",
                    name: "Roles_id",
                    message: "Which role do you want to assign the selected employee?",
                    choices: roleChoices
                  }
                ])
                .then(res => {
                  return db.promise().query("UPDATE employee SET role_id = ? WHERE id = ?", [res.Roles_id, empRole])})
                .then(() => console.log("Updated employee's role"))
                .then(() => start())
            });
        })
    })
};              
                
                


