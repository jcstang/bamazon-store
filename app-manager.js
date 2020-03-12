const inquirer = require('inquirer');
const butler = require('./butler-funcs');
const chalk = require('chalk');

function promptUser() {
  console.log('Hi, manager view here');
  inquirer.prompt([
    {
      type: 'list',
      name: 'mainChoice',
      message: chalk.magentaBright.bold('What would you like to do today?'),
      choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product', 'exit']
    }
  ])
    .then(answers => {
      butler.displayTable();
      // TODO: decide which guess
      // TODO: under each answer, create function to handle logic

      switch (answers.mainChoice) {
        case 'View Products for Sale':
          break;

        case 'View Low Inventory':
          break;

        case 'Add to Inventory':
          break;

        case 'Add New Product':
          break;

        case 'exit':
          break;

        default:
          break;
      }


    })
    .catch(error => {
      throw error;
    });

}

module.exports = {
  promptUser: promptUser
}