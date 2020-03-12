require('dotenv').config();
const chalk = require('chalk');
const figlet = require('figlet');
const inquirer = require('inquirer');
const mysql = require('mysql');
const keys = require('./keys');
const Table = require('cli-table');

let storeTheStoreNew;

// ===================================================
// menu options
// ===================================================
function viewProducts() {
  console.log('viewProducts func');
  // helper.startUpStore();
  displayTable();
}

function addToInventory() {
  console.log('addToInventory func');
}

function addNewProduct() {
  console.log('addNewProduct func');
}

// menu option
function viewLowInventory() {
  console.log('viewLowInventory func');
}
// ====================================================


function displayTable() {
  console.log('here is the table');
  // getDatabaseData();
  hookUpToDB();
}

function printFiglet(message) {
  figlet(message, function (err, data) {
    if (err) {
      throw err;
    }
    // welcome message
    console.log(data);
    console.log(`\n\n`);
    
  });
}

function hookUpToDB() {
  printFiglet('Welcome to bamazon!');
  
  connection = mysql.createConnection({
    host: keys.creds.hostName,
    port: 8889,
    user: keys.creds.userName,
    password: keys.creds.password,
    database: "bamazon"
  });

  connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + chalk.yellow(connection.threadId));
    // getDatabaseData();
    updateLocalData();
  });
}

function getDatabaseData() {
  
  // connection = mysql.createConnection({
  //   host: keys.creds.hostName,
  //   port: 8889,
  //   user: keys.creds.userName,
  //   password: keys.creds.password,
  //   database: "bamazon"
  // });

  // connection.connect(function(err) {
  //   if (err) throw err;
  //   console.log("connected as id " + chalk.yellow(connection.threadId));
  // });

  // connection.query("SELECT item_id, product_name, price, department_name, stock_quantity FROM bamazon.products;",function(err, data, fields) {
  //   if(err) {
  //     throw err;
  //   }

  //   // store the query data locally
  //   let storeTheStore = data;
  //   storeTheStoreNew = [];
  //   storeTheStore.forEach(element => {

  //     let obj = {
  //       id: element.item_id,
  //       name: element.product_name,
  //       price: element.price,
  //       stock: element.stock_quantity,
  //       deptName: element.department_name

  //     }
  //     storeTheStoreNew.push(obj);
      
  //   });
    
  //   printyPrint(data, fields);
  //   // promptBuyer();

  // });
}

function updateLocalData() {
  connection.query("SELECT item_id, product_name, price, department_name, stock_quantity FROM bamazon.products;",function(err, data, fields) {
    if(err) {
      throw err;
    }

    storeTheStoreNew = data.map(function(product) {
      let obj = {
        id: product.item_id,
        name: product.product_name,
        price: product.price,
        stock: product.stock_quantity,
        deptName: product.department_name
      };

      return obj;
    });

    printyPrint(data, fields);

  });

function promptUserAboutPurchase() {
  inquirer.prompt([
    {
      type: 'number',
      name: 'product_id',
      message: 'What product ID would you like?'
    },
    {
      type: 'number',
      name: 'product_quantity',
      message: 'how many do you want?'
    }
  ])
  .then((answers) => {
    console.log(answers);
    
  }).catch(error => {
    console.log(error);
  });
}

function printyPrint(data, fields) {
  let table = new Table({
    chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
    , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
    , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
    , 'right': '║' , 'right-mid': '╢' , 'middle': '│' }
  });

  table.push(
    [fields[0].name, fields[1].name, fields[2].name]
  );
    
  data.forEach(element => {
    table.push([element.item_id, element.product_name, element.price]);
    
  });

  //prints table
  console.log(table.toString());
}


module.exports = {
  displayTable: displayTable,
  printFiglet: printFiglet,
  addNewProduct: addNewProduct,
  addToInventory: addToInventory,
  viewLowInventory: viewLowInventory,
  promptUserAboutPurchase: promptUserAboutPurchase,
  viewProducts: viewProducts
}