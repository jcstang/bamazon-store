let helperInventory = require('./inventory-funcs');

helperInventory.promptUser();

// ===================================================
// on exit
// ===================================================
process.on('exit', (code) => {
  console.log(`Ich gehe jetzt mit Code: ${code}`);
});