const helper = require('./helper-funcs');

// ===================================================
// START
// ===================================================
helper.startUpStore();




// ===================================================
// on exit
// ===================================================
process.on('exit', (code) => {
  console.log(`Ich gehe jetzt mit Code: ${code}`);
  helper.printFiglet("Come again!");
});