// db functions
require('dotenv').config();
const keys = require('./keys');
const mysql = require('mysql');

let connection;
let thing;

connectToMySql();

function connectToMySql() {
  connection = mysql.createConnection({
    host: keys.creds.hostName,
    port: 8819,
    user: keys.creds.userName,
    password: keys.creds.password,
    database: "bamazon"
  });
  
  connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + chalk.yellow(connection.threadId));
  });

  thing = connectToMySql();
  console.log('loaded for sure');

}