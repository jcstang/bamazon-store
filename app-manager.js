const inquirer = require('inquirer');
const butler = require('./butler-funcs');
const chalk = require('chalk');

function promptUser() {
  console.log('Hi, manager view here');
  // butler.printFiglet('Hello, Manager!');

  inquirer.prompt([
    {
      type: 'list',
      name: 'mainChoice',
      message: chalk.magentaBright.bold('Hello Manager! What would you like to do?'),
      choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product', 'exit']
    }
  ])
    .then(answers => {
      // butler.displayTable();
      // TODO: under each answer, create function to handle logic

      switch (answers.mainChoice) {
        case 'View Products for Sale':
          butler.viewProducts();
          // FIXME: data table is covering the next prompt.
          // arrow keys will let it show up again but still
          // a hidden menu.
          process.exit(0);
          // promptUser();
          break;

        case 'View Low Inventory':
          butler.viewLowInventory();
          process.exit(0);
          // promptUser();
          break;

        case 'Add to Inventory':
          butler.addToInventory();
          process.exit(0);
          // promptUser();
          break;

        case 'Add New Product':
          butler.addNewProduct();
          process.exit(0);
          // promptUser();
          break;

        case 'exit':
          process.exit(0);
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