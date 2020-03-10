require('dotenv').config();
const inquirer = require('inquirer');
const mysql = require('mysql');
const chalk = require('chalk');
const figlet = require('figlet');
const keys = require('./keys');
const Table = require('cli-table');

// ===================================================
// START
// ===================================================
startupStore();

function startupStore() {

  figlet('Welcome to bamazon!', function(err, data) {
    if (err) {
      throw err;
    }
    console.log(data);
    
  });
  

  let connection = mysql.createConnection({
    host: keys.creds.hostName,
    port: 8889,
    user: keys.creds.userName,
    password: keys.creds.password,
    database: "bamazon"
  });

  connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + chalk.yellow(connection.threadId));
    // goGetData();
  });

  connection.query("SELECT item_id, product_name, price FROM bamazon.products;",function(err, data, fields) {
    console.log(err);
    console.log(data);
    console.log(fields);
    console.log(fields[0].name);
    
    
    let table = new Table({
      chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
             , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
             , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
             , 'right': '║' , 'right-mid': '╢' , 'middle': '│' }
    });
     
    table.push(
        [fields[0].name, fields[1].name, fields[2].name]
      , ['frob', 'bar', 'quuz']
    );
     
    console.log(table.toString());
    
    
  });


}

function startQuestions() {
  // ask want to start?
}

// function fulfillOrder(key, qty) {
//   pool.query(`SELECT stock_quantity FROM bamazon.products WHERE item_id=${key}`, function(error, results, fields) {
//     if (error) {
//       throw error;
//     }
//     console.log('the thing is: ', results);
    
//   });
  
// }

// let arrOfData = [];
// let arrOfData2 = [];
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
      message: 'how much do you want?'
    }
  ])
      .then((answers) => {
        getRecordFromKey(answers.product_id);
        doesProductHaveEnough(answers.product_id, answers.product_quantity);

      }).catch(error => {
        console.log(error);
        
      });


}

function getRecordFromKey(key) {
  
  let queryString = `SELECT item_id, product_name, stock_quantity FROM bamazon.products WHERE item_id=${key};`;
  // console.log(queryString);
  
  connection.query(queryString, function(err, data) {
    if (err) {
      throw err;
    }
    // console.log(data);
    printTable(data);
    // process.exit(0);
    // return data;

  });
  
}

function doesProductHaveEnough(key, quantity) {
  console.log('start of doesProductHaveEnough');
  
  let queryString = `SELECT item_id, product_name, stock_quantity FROM bamazon.products WHERE item_id=${key};`;
  // console.log(queryString);
  
  connection.query(queryString, function(err, data) {
    if (err) {
      throw err;
    }

    console.log(data);
    console.log(data[0].stock_quantity);
    
    if(quantity > data[0].stock_quantity) {
      console.log(chalk.red('there is not enough!!!!!!!!!!!!!!'));
      process.exit(1); 
    }
    fulfillOrder(data[0].item_id, data[0].stock_quantity);
    // console.log(data);
    // printTable(data);
    // process.exit(0);
    // return data;

    console.log('end of doesProductHaveEnough');
  });
}

function goGetData() {
  let queryString = "SELECT item_id, product_name, department_name, price, stock_quantity FROM bamazon.products;"

  connection.query(queryString, function(err, res) {
    if (err) {
      throw err;
    }

    printTable(res);
    promptBuyer();
    
    // connection.end();
  });

}

function printTable(arr) {
  console.log(`${chalk.red('item_id')} product_name ${chalk.bgYellow.black('department_name')} ${chalk.magenta('price')} ${chalk.greenBright('stock')}`);

  arr.forEach(el => {
    console.log(chalk.blue('------------------------------------------------------------------'));
    console.log(`${chalk.red(el.item_id)} ${el.product_name} ${chalk.bgYellow.black(el.department_name)} ${chalk.magenta(el.price)} ${chalk.greenBright(el.stock_quantity)}`);
    
  });
  
}



// ===================================================
// on exit
// ===================================================
process.on('exit', (code) => {
  console.log(`About to exit with code: ${code}`);
  connection.end();
});