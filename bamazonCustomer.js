const helper = require('./helper-funcs');

// ===================================================
// START
// ===================================================
helper.startUpStore();




// ===================================================
// on exit
// ===================================================
process.on('exit', (code) => {
  console.log(`About to exit with code: ${code}`);
  console.log('ending connection...');
  if(helper.connection) {
    helper.connection.end();
    printFiglet("Come again!");
  }
});