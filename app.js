// prompt for a menu
  // customer or manager
    // customer menu
    // manager menu

// query data and store locally
// func display data
// sort/print low inventory (another query)
// print figlet
const inquirer = require('inquirer');
const mananger = require('./app-manager');
const customer = require('./app-customer');
const chalk = require('chalk');

mainMenu();

function mainMenu() {
  inquirer.prompt([
    {
      type: 'list',
      name: 'forkChoice',
      message: chalk.magentaBright.bold('What would you like to do today?'),
      choices: ['See Manager View', 'See Customer View', 'Exit']
    }
  ])
  .then(answers => {
    console.log(answers);
    
    switch (answers.forkChoice) {
      case 'See Manager View':
        mananger.promptUser();
        break;
      case 'See Customer View':
        customer.promptUser();
        break;
      case 'Exit':
        process.exit(0);
        break;

      default:
        break;
    }
  })
  .catch(error => {
    // console.error(error);
    throw error;
  })

}

// ===================================================
// on exit
// ===================================================
process.on('exit', (code) => {
  console.log(`Ich gehe jetzt mit Code: ${code}`);
});




module.exports = {
  mainMenu: mainMenu
}