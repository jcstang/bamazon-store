require('dotenv').config();
const chalk = require('chalk');
const figlet = require('figlet');
const inquirer = require('inquirer');
const mysql = require('mysql');
const keys = require('./keys');
const Table = require('cli-table');

let storeTheStoreNew;
let connection;
let theFields = [
  {
    name: 'item_id'
  },
  {
    name: 'product_name'
  },
  {
    name: 'price'
  }
];

hookUpToDB();


// ===================================================
// menu options
// ===================================================
function viewProducts() {
  console.log('viewProducts func');
  // displayTable();
  

  // connect to mysql
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
    // updateLocalData();
    // updateLocalData();
  });

  connection.query("SELECT item_id, product_name, price, department_name, stock_quantity FROM bamazon.products;",function(err, data, fields) {
    if(err) {
      throw err;
    }

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
      table.push([element.id, element.name, element.price]);
      
    });
    
    // prints the table
    console.log(table.toString());

    // printyPrint(data, fields);
    // jsonToTable(storeTheStoreNew);

  });


}

function viewLowInventory() {
  console.log('viewLowInventory func');
  updateLocalData();
  printyPrint(storeTheStoreNew, theFields);
  // console.log(storeTheStoreNew);
  // jsonToTable(storeTheStoreNew);
  
}

function addToInventory() {
  console.log('addToInventory func');
  displayTable();
}

function addNewProduct() {
  console.log('addNewProduct func');
}






// ===================================================
// helper functions
// ===================================================
function jsonToTable(array) {
  
  // console.log(array);
  
  if (array !== undefined) {
    printyPrint(array, fields);
  }
}


function displayTable() {
  console.log('here is the table');
  // getDatabaseData();
  hookUpToDB();
  printyPrint(storeTheStoreNew, theFields);
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
  // printFiglet('Welcome to bamazon!');

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
    // updateLocalData();
    updateLocalData();
  });
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

    // printyPrint(data, fields);
    // jsonToTable(storeTheStoreNew);

  });
}

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
    table.push([element.id, element.name, element.price]);
    
  });
  
  console.log(table.toString());
  //prints table
  // console.log(table.toString());
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