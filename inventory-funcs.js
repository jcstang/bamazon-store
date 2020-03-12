let figlet = require('figlet');
let inquirer = require('inquirer');
let chalk = require('chalk');

function viewProducts() {
  console.log('viewProducts func');
}

function viewLowInventory() {
  console.log('viewLowInventory func');
}

function addToInventory() {
  console.log('addToInventory func');
}

function addNewProduct() {
  console.log('addNewProduct func');
}

function printFiglet(message) {
  figlet(message, function (err, data) {
    if (err) {
      throw err;
    }
    // welcome message
    console.log(data);

  });
}

function promptUser() {

  inquirer
    .prompt([
      {
        type: 'list',
        name: 'mainChoice',
        message: chalk.magentaBright.bold('What would you like to do today?'),
        choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product', 'exit']
      }
    ])
    .then(answers => {
      console.log('answers');


      switch (answers.mainChoice) {
        case 'View Products for Sale':
          viewProducts();
          break;

        case 'View Low Inventory':
          helperInventory.viewLowInventory();
          break;

        case 'Add to Inventory':
          helperInventory.addToInventory();
          break;

        case 'Add New Product':
          helperInventory.addNewProduct();
          break;

        case 'exit':
          process.exit(0);
          break;

        default:
          break;
      }


    })
    .catch(error => {
      if (error.isTtyError) {
        // Prompt couldn't be rendered in the current environment
      } else {
        // Something else when wrong
      }
    });
}

module.exports = {
  viewProducts: viewProducts,
  viewLowInventory: viewLowInventory,
  addToInventory: addToInventory,
  addNewProduct: addNewProduct,
  printFiglet: printFiglet,
  promptUser: promptUser
}