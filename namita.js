// ===================================================
// code from my tutor Namita Shenai
// ===================================================

function displayInventory() {

  console.log(clc.bold("\n Displaying inventory for all supplies..... until stock lasts \n"));
  // console.log("--------------------------------------------------------------- \n");

  var query = connection.query(
      "SELECT * FROM products ;",
      function (err, res) {
          //throw error 
          if (err) throw clc.red.bold(err);
          // Log all results of the SELECT statement
          //   console.log(res);

          var vertical_table = new Table({

              chars: {
                  'top': '═', 'top-mid': '╤', 'top-left': '╔', 'top-right': '╗'
                  , 'bottom': '═', 'bottom-mid': '╧', 'bottom-left': '╚', 'bottom-right': '╝'
                  , 'left': '║', 'left-mid': '╟', 'mid': '─', 'mid-mid': '┼'
                  , 'right': '║', 'right-mid': '╢', 'middle': '│'
              },
              style: { 'padding-left': 2, 'padding-right': 2 }
          });

          //Add TABLE HEADERS 
          vertical_table.push([clc.blue.bold("Item ID"), clc.blue.bold("Product Name"), clc.blue.bold("Department Name"), clc.blue.bold("Price"), clc.blue.bold("Stock Quantity")]);

          //ADD ALL ROWS IN THE TABLE TO DISPLAY INVENTORY 
          for (var i = 0; i < res.length; i++) {
              //Displaying price in format $
              let opts = { format: '%s%v %c', code: 'USD', symbol: '$ ' }
              vertical_table.push([res[i].item_id, res[i].product_name, res[i].department_name, formatCurrency(res[i].price, opts), res[i].stock_quantity]);
          }
          console.log(vertical_table.toString());

          //Would you like to purchase an item 
          purchaseItem();
      });


}