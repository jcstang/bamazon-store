require('dotenv').config();
const inquirer = require('inquirer');
const mysql = require('mysql');
const chalk = require('chalk');
const figlet = require('figlet');
const keys = require('./keys');
const Table = require('cli-table');
let connection;
let storeTheStoreNew = [];

// ===================================================
// START
// ===================================================
startupStore();


// ===================================================
// functions
// ===================================================
function startupStore() {

  // figlet('Welcome to bamazon!', function(err, data) {
  //   if (err) {
  //     throw err;
  //   }
  //   // welcome message
  //   console.log(data);
    
  // });
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

    // dataStore = data;
    // console.log('datastore');
    // console.log(dataStore);
    // console.log(dataStore[0]);

    // data.forEach(element => {
    //   storeTheStore.push(element);
    // });
    storeTheStore = data;
    // console.log('storeTheStore');
    // console.log(storeTheStore);
    storeTheStore.forEach(element => {
      // console.log(`item_id: ${element.item_id} product: ${element.product_name}`);

      let obj = {
        id: element.item_id,
        name: element.product_name,
        price: element.price,
        stock: element.stock_quantity,
        deptName: element.department_name

      }
      storeTheStoreNew.push(obj);
      
    });
    
    // console.log('storeTheStoreNew');
    // console.log(storeTheStoreNew);
    
    
    

    printyPrint(data, fields);
    promptBuyer();

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

    connection.query("SELECT * FROM bamazon.products", function(err, data, fields){
      if(err) {
        throw err;
      }


    });

    getRecordFromKey(answers.product_id);
    // doesProductHaveEnough(answers.product_id, answers.product_quantity);

    if (hasStock(answers.product_id, answers.product_quantity)) {
      console.log(chalk.greenBright('hooray! nice purchase'));
      // TODO: update DB
      updateDB(answers.product_id, answers.product_quantity);
      // process.exit(0);
    } else {
      console.log(chalk.red('out of stock'));
      process.exit(1);
    }


  }).catch(error => {
    console.log(error);
  });

}
// UPDATE songs SET genre='Pop' WHERE id=2;
function updateDB(key, orderAmt) {
  console.log('updating DB......');

  // TODO: update db
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



// ===================================================
// on exit
// ===================================================
process.on('exit', (code) => {
  console.log(`About to exit with code: ${code}`);
  console.log('ending connection...');
  if(connection) {
    connection.end();
    figlet('Come again!', function(err, data) {
      if (err) {
        throw err;
      }
      console.log(data);
      
    });
  }
});