require("dotenv").config();
const mysql = require("mysql");
const inquirer = require("inquirer");

//Connect to database

const connection = mysql.createConnection(
    {
        host: "localhost",
        port: 3306,
        user: "root",
        password: process.env.MYSQL_PASS,
        database: "employeesDB"
    });

connection.connect(err => {
    if (err)
        throw err;

    console.log("Welcome to eployee tracker!");
    MainMenu();
});

//Main Menu
function MainMenu() {
    inquirer.prompt(
        {
            message: "MAIN MENU: What would you like to do?",
            type: "list",
            name: "menu",
            choices: [
                "View All Departments",
                "View All Employees",
                "View All Roles",
                "Add Department",
                "Add Employee",
                "Add Role",
                "Update Employee Role",
                "Exit"
            ]
        }).then((answer) => {
            //switch depending on choice
            switch (answer.menu) {
                case "View All Departments":
                    viewAllDepts();
                    break;
                case "View All Employees":
                    viewAllEmps();
                    break;
                case "View All Roles":
                    viewAllRoles();
                    break;
                case "Add Department":
                    addDept();
                    break;
                case "Add Employee":
                    addEmp();
                    break;
                case "Add Role":
                    addRole();
                    break;
                case "Update Employee Role":
                    updateRole();
                    break;
                case "Exit":
                    connection.end();
                    break;
            }
        });
}

//functions for cases
const viewAllDepts = () => {
    connection.query("SELECT * from department", function (err, res) {
        if (err)
            throw err;
            console.log(`-------------------------\nDEPARTMENTS:`);
        for (i = 0; i < res.length; i++) {
            console.log(`${res[i].id}.) ${res[i].dept_name}`);
        }
        console.log(`-------------------------`);
        MainMenu();

    });
}

const viewAllEmps = () => {
    connection.query("SELECT id, first_name, last_name, role_id FROM employee LEFT JOIN role ON employee.role_id = role.id", function(err, res){
        if(err)
            throw(err);
        for(i = 0; i < res.length; i++){
            console.log(`${res[i].id}.) ${res[i].first_name} ${res[i].last_name} : `)
        }
    })
}
const viewAllRoles = () => {
    connection.query("SELECT * from role", function(err, res){
        if(err)
            throw(err);
        console.log(`-------------------------\nROLES:`);
        for(i = 0; i < res.length; i++){
            console.log(`${res[i].id}.) ${res[i].title} (Salary: $${res[i].salary})`);
        }
        console.log(`-------------------------`);
        MainMenu();
    })
}

const addDept = () => {
    inquirer.prompt({
        type: "input",
        message: "Enter the name of the department you would like to add:",
        name: "department"
    }).then((answer) => {
        connection.query("INSERT INTO department SET ?",
            {
                dept_name: answer.department,
            },
            function (err, res) {
                if (err) return err;
                console.log("Success! Department added...");
                MainMenu();
            });
    });
}

const addEmp = () => {
    let rolesArr = [];
    let objects = {};
    connection.query("SELECT * from role", function (err, res) {
        if(err)
            throw err;
        for (i = 0; i < res.length; i++) {
            objects[i] = {id : res[i].id, name : res[i].title}
            rolesArr.push(objects[i]);
        }
    })
    inquirer.prompt([
        {
            type: "input",
            message: "Enter the employee's first name:",
            name: "firstName"
        },
        {
            type: "input",
            message: "Enter the employee's last name:",
            name: "lastName"
        },
        {
            type: "list",
            message: "Select the employee's role:",
            choices: rolesArr,
            name: "jobTitle"
        }
    ]).then((answer) => {
        let roleID = "";
        for(i = 0; i < rolesArr.length; i++){
            if(answer.jobTitle == rolesArr[i].name){
                roleID = rolesArr[i].id;
            }
        }
        console.log(roleID);
        connection.query(`INSERT INTO employee(first_name, last_name, role_id) VALUES("${answer.firstName}", "${answer.lastName}", "${roleID}")`, (err, res) => {
            if(err)
            return err;
            console.log(`${answer.firstName} ${answer.lastName} added to employees...`);
            MainMenu();
        });
    })

}

const addRole = () => {
    let objects = {};
    let departmentArr = [];
    connection.query("SELECT * from department", function (err, res) {
        if (err)
            throw err;
        for (i = 0; i < res.length; i++) {
            objects[i] = {id : res[i].id, name : res[i].dept_name}
            departmentArr.push(objects[i]);
        }
        inquirer.prompt([
            {
                type: "input",
                message: "Enter the name of the role you would like to add:",
                name: "title"
            },
            {
                type: "list",
                message: "Select the department of this role:",
                choices: departmentArr,
                name: "roleDepart"
            },
            {
                type: "input",
                message: "Enter a salary ($) for this role:",
                name: "salary"
            }
        ]).then((answer) => {
            let deptID = "";
            for(i = 0; i < departmentArr.length; i++){
                if(answer.roleDepart == departmentArr[i].name){
                    deptID = departmentArr[i].id;
                }
            }
            connection.query(`INSERT INTO role(title, salary, department_id) VALUES("${answer.title}", "${answer.salary}", "${deptID}")`, (err, res) => {
                if(err)
                return err;
                console.log(`${answer.title} added to roles...`);
                MainMenu();
            });
        });

    });
}
const updateRole = () => {

}