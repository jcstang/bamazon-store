const inquirer = require('inquirer');
const mysql = require('mysql');
const chalk = require('chalk');

let connection = mysql.createConnection({
  host: "localhost",
  port: 8889,
  user: "root",
  password: "root",
  database: "bamazon"
});
connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + chalk.yellow(connection.threadId));
});