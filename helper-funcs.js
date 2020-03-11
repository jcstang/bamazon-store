require('dotenv').config();
const inquirer = require('inquirer');
const mysql = require('mysql');
const chalk = require('chalk');
const figlet = require('figlet');
const keys = require('./keys');
const Table = require('cli-table');

let connection;
let storeTheStoreNew = [];

function startupStore() {

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
  });

  connection.query("SELECT item_id, product_name, price, department_name, stock_quantity FROM bamazon.products;",function(err, data, fields) {
    if(err) {
      throw err;
    }

    // store the query data locally
    let storeTheStore = data;
    storeTheStoreNew = [];
    storeTheStore.forEach(element => {

      let obj = {
        id: element.item_id,
        name: element.product_name,
        price: element.price,
        stock: element.stock_quantity,
        deptName: element.department_name

      }
      storeTheStoreNew.push(obj);
      
    });
    
    printyPrint(data, fields);
    promptBuyer();

  });

}

function updateLocalData() {
  connection.query("SELECT item_id, product_name, price, department_name, stock_quantity FROM bamazon.products;",function(err, data, fields) {
    if(err) {
      throw err;
    }

    // store the query data locally
    let storeTheStore = data;
    storeTheStoreNew = [];
    storeTheStore.forEach(element => {

      let obj = {
        id: element.item_id,
        name: element.product_name,
        price: element.price,
        stock: element.stock_quantity,
        deptName: element.department_name

      }
      storeTheStoreNew.push(obj);
      
    });

  });
}


function promptBuyer() {

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

    getRecordFromKey(answers.product_id);

    if (hasStock(answers.product_id, answers.product_quantity)) {
      console.log(chalk.greenBright('hooray! nice purchase'));
      // TODO: update DB
      updateDB(answers.product_id, answers.product_quantity);
      updateLocalData();
      // process.exit(0);
    } else {
      console.log(chalk.red(`Sorry, we are ${chalk.bgCyanBright('out of stock')} on that item.`));
      process.exit(1);
    }

  }).catch(error => {
    console.log(error);
  });

}


function updateDB(key, orderAmt) {

  let queryString = `UPDATE bamazon.products SET stock_quantity=stock_quantity-${orderAmt} WHERE item_id=${key};`;
  connection.query(queryString, function(err, data, fields) {
    if(err){
      throw err;
    }

    console.log(chalk.greenBright('db UPDATED'));
    process.exit(0);
  });
}


function hasStock(key, amtAsking) {
  console.log('made it to hasStock');
  
  let productArray = storeTheStoreNew.filter(function(product) {
    // console.log(product);
    
    return product.id === key;
  });

  console.log(`amtAsking: ${amtAsking} stock: ${productArray[0].stock}`);
  if( amtAsking < productArray[0].stock) {
    return true;
  }

  return false; 
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


function getRecordFromKey(key) {

  // TODO: filter to find specific id/key
  let selectedProduct = storeTheStoreNew.filter(function(product){
    return product.id === key
  });
  console.log(selectedProduct);
  

}

function printFiglet(message) {
  figlet(message, function(err, data) {
    if (err) {
      throw err;
    }
    // welcome message
    console.log(data);
    
  });
}

module.exports = {
  printFiglet: printFiglet,
  getRecordFromKey: getRecordFromKey,
  hasStock: hasStock,
  printyPrint: printyPrint,
  updateDB: updateDB,
  promptBuyer: promptBuyer,
  updateLocalData: updateLocalData,
  startUpStore: startupStore,
  connection: connection
}