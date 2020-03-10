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
  goGetData();
});

let pool  = mysql.createPool({
  connectionLimit : 10,
  host            : 'localhost',
  port            : 8889,
  user            : 'root',
  password        : 'root',
  database        : 'bamazon'
});

// pool.query('SELECT * FROM bamazon.products', function (error, results, fields) {
//   if (error) {
//     throw error;
//   }
//   console.log('the thing is: ', results);
  
//   // console.log('The solution is: ', results[0].solution);
// });
function fulfillOrder(key, qty) {
  pool.query(`SELECT stock_quantity FROM bamazon.products WHERE item_id=${key}`, function(error, results, fields) {
    if (error) {
      throw error;
    }
    console.log('the thing is: ', results);
    
  });
  
}

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