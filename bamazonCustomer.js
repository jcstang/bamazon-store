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

// let arrOfData = [];
// let arrOfData2 = [];
function promptBuyer() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'productId',
      message: 'What product ID would you like?'
    },
    {
      type: 'number',
      name: 'quantityProd',
      message: 'how much do you want?'
    }
  ])
      .then((answers) => {
        console.log(answers);
      }).catch(error => {

  });


}

function goGetData() {

  let queryString = "SELECT item_id, product_name, department_name, price, stock_quantity FROM bamazon.products;"

  connection.query(queryString, function(err, res) {
    if (err) {
      throw err;
    }

    printTable(res);
    
    connection.end();
  });

}

function printTable(arr) {
  console.log(`${chalk.red('item_id')} product_name ${chalk.bgYellow.black('department_name')} ${chalk.magenta('price')} ${chalk.greenBright('stock')}`);

  arr.forEach(el => {
    console.log(chalk.blue('------------------------------------------------------------------'));
    console.log(`${chalk.red(el.item_id)} ${el.product_name} ${chalk.bgYellow.black(el.department_name)} ${chalk.magenta(el.price)} ${chalk.greenBright(el.stock_quantity)}`);
    
  });
  
}