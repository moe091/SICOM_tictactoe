var Game = require('./Game.js');


class Options {
  constructor() {
    this.scoreX = 0;
    this.scoreO = 0;
    this.option6;
    this.option7;
    this.option8;
    this.option9;
  }
  
  // checks if num corresponds to an existing option. If so it executes option and returns true, otherwise returns false
  try(num) {
    if (typeof this["option" + num] != 'undefined') {
      this["option" + num].func();
      return true;
    }
    return false;
  }
  
  // just renders the options menu
  renderOptions() {
    process.stdout.write("           X Wins: " + this.scoreX + "     -     O Wins: " + this.scoreO);
    process.stdout.write("\nOptions: Enter any number below at any time to select that option\n      ");
    for (var i = 6; i <= 9; i++) {
      if (typeof this["option" + i] != 'undefined') {
        process.stdout.write(i + ". " + this["option" + i].name);
        process.stdout.write("    ");
      }
    }
  }
  
  /**
  * Adds an option. Returns true if successful, false if not. Only 6, 7, 8, and 9 are allowed as option numbers
  *
  * @param number, Number - the number that when input, calls the option
  * @param name, String - name to be displayed in option menu
  * @param func, Func() - function to be called when option is selected
  **/
  addOption(number, name, func) {
    if (number >= 6 && number <= 9) {
      var option = {number, name, func};
      this["option" + number] = option;
      return true;
    } else {
      return false;
    }
  }
  
  // add a win to scoreboard
  addWin(mark) {
    if (mark == 'X') {
      this.scoreX++;
    } else if (mark == 'O') {
      this.scoreO++;
    }
  }
  
  
}

module.exports = Options;