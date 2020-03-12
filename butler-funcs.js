const chalk = require('chalk');


function viewProducts() {
  console.log('viewProducts func');
  helper.startUpStore();
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

function displayTable() {
  console.log('here is the table');
  
}

function promptUser() {
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

    getRecordFromKey(answers.product_id);

    if (hasStock(answers.product_id, answers.product_quantity)) {
      console.log(chalk.greenBright('hooray! nice purchase'));
      
      updateDB(answers.product_id, answers.product_quantity);
      updateLocalData();
    } else {
      console.log(chalk.red(`Sorry, we are ${chalk.bgCyanBright('out of stock')} on that item.`));
      process.exit(1);
    }

  }).catch(error => {
    console.log(error);
  });
}


module.exports = {
  displayTable: displayTable
}