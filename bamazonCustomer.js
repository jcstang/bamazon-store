require('dotenv').config();
const inquirer = require('inquirer');
const mysql = require('mysql');
const chalk = require('chalk');
const figlet = require('figlet');
const keys = require('./keys');
const Table = require('cli-table');
let connection;

// ===================================================
// START
// ===================================================
startupStore();


// ===================================================
// functions
// ===================================================
function startupStore() {

  
  figlet('Welcome to bamazon!', function(err, data) {
    if (err) {
      throw err;
    }
    // welcome message
    console.log(data);
    
  });
  
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

  connection.query("SELECT item_id, product_name, price FROM bamazon.products;",function(err, data, fields) {
    if(err) {
      throw err;
    }

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
      console.log('hooray! nice purchase');
      process.exit(0);
    } else {
      console.log('out of stock');
      process.exit(1);
    }


  }).catch(error => {
    console.log(error);
  });

}

function getDataPromise(key) {
  // let qString = `SELECT * FROM bamazon.products WHERE item_id=${key}`
  // connection.query(qString, (err, data, fields) => {
  //   if (err) {
  //     throw err;
  //   }
  // });

  // let myFirstPromise = new Promise((resolve, reject) => {
  //   // We call resolve(...) when what we were doing asynchronously was successful, and reject(...) when it failed.
  //   // In this example, we use setTimeout(...) to simulate async code. 
  //   // In reality, you will probably be using something like XHR or an HTML5 API.
  //   setTimeout( function() {
  //     resolve("Success!");  // Yay! Everything went well!
  //   }, 250) 
  // }) 
  
  // return myFirstPromise.then((successMessage) => {
  //   // successMessage is whatever we passed in the resolve(...) function above.
  //   // It doesn't have to be a string, but if it is only a succeed message, it probably will be.
  //   console.log("Yay! " + successMessage);
  // });

}

function hasStock(key, amtAsking) {
  console.log('made it to hasStock');

  getDataPromise(key).then(function(res) {
    console.log('promise fulfilled');
    
  });
  // getDataPromise(key).then(function(res) {
  //   console.log('returned from getDataPromise');
    
  // });
  
  let qString = `SELECT * FROM bamazon.products WHERE item_id=${key}`
  connection.query(qString, function(err, data, fields) {
    console.log(data);
    
    if(amtAsking > data[0].stock_quantity) {
      return false;
    }

  });

  return true; 
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

  let queryString = `SELECT item_id, product_name, price FROM bamazon.products WHERE item_id=${key}`;
  connection.query(queryString,function(err, data, fields) {
    if(err) {
      throw err;
    }

    printyPrint(data, fields);

  });

}


// function doesProductHaveEnough(key, quantity) {
//   console.log('start of doesProductHaveEnough');
  
//   let queryString = `SELECT item_id, product_name, stock_quantity FROM bamazon.products WHERE item_id=${key};`;
//   // console.log(queryString);
  
//   connection.query(queryString, function(err, data) {
//     if (err) {
//       throw err;
//     }

//     console.log(data);
//     console.log(data[0].stock_quantity);
    
//     if(quantity > data[0].stock_quantity) {
//       console.log(chalk.red('there is not enough!!!!!!!!!!!!!!'));
//       process.exit(1); 
//     }
//     fulfillOrder(data[0].item_id, data[0].stock_quantity);
//     // console.log(data);
//     // printTable(data);
//     // process.exit(0);
//     // return data;

//     console.log('end of doesProductHaveEnough');
//   });
// }



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