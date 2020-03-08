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

let arrOfData = [];
let arrOfData2 = [];


function goGetData() {

  connection.query("SELECT * FROM products", function(err, res) {
    if (err) {
      throw err;
    }
    arrOfData = res;
    // console.log(res);

    // for (const iterator of res) {
    //   arrOfData.push(iterator);
    // }
    // console.log('-----');
    // console.log(arrOfData);
    // res.forEach(element => {
    //   arrOfData.push(element);
    // });
    // console.log(`item_id\tproduct_name\t\t\tdept_name\tprice\tstock`);

    printTable(arrOfData);
    
    arrOfData.forEach(element => {
      // console.log(`item_id: ${element.item_id} product_name: ${element.product_name} dept name: ${element.department_name} price: ${element.price} stock: ${element.stock_quantity}`);
      // console.log(`${element.item_id}\t\t${element.product_name}\t\t\t\t${element.department_name}\t${element.price}\t${element.stock_quantity}`);
    });
    

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