const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

class ATM {
  #balance = 0;
  #menuItems = [
    {
      name: "deposit",
      method: async () => await this.#deposit(),
    },
    {
      name: "see balance",
      method: async () => this.#getBalance(),
    },
    {
      name: "withdraw",
      method: async () => await this.#withdraw(),
    },
    {
      name: "exit",
      method: async () => this.#exit(),
    },
  ];
  #keepRunning = true;

  async main() {
    while (this.#keepRunning) {
      console.log("");
      this.#showMenu();

      const operation = await this.#getOperation();

      await this.#switcher(operation);
    }
  }

  #showMenu = () =>
    this.#menuItems.forEach((item, index) =>
      console.log(`${index + 1}. ${item.name}`)
    );

  #getOperation = async () => {
    while (true) {
      const operation = +(await this.#askQuestion(
        "please choose your operation: "
      ));

      if (this.#isValidOperation(operation)) return operation;

      console.log("please choose a valid operation");
    }
  };

  #switcher = async (operation) =>
    await this.#menuItems[operation - 1].method(); // -1 for ui index start from 1

  #isValidOperation = (operation) =>
    !isNaN(operation) && operation > 0 && operation <= this.#menuItems.length;

  #askQuestion = (question) =>
    new Promise((resolve) =>
      readline.question(question, (input) => resolve(input))
    );

  // operations ↓
  #isValidMoney = (money, max = Number.MAX_VALUE) =>
    !isNaN(money) && money > 0 && money <= max;

  #deposit = async () => {
    while (true) {
      const money = +(await this.#askQuestion("please enter you money:$ "));

      if (this.#isValidMoney(money)) {
        this.#balance += money;
        console.log(`$${money} added to your balance`);
        return;
      }

      console.log("please write a valid value");
    }
  };

  #getBalance = () => console.log(`your balance is $${this.#balance}`);

  #withdraw = async () => {
    while (true) {
      const money = +(await this.#askQuestion("please enter you money:$ "));

      if (this.#isValidMoney(money, this.#balance)) {
        this.#balance -= money;
        console.log(`$${money} withdrew from your bank account`);
        return;
      } else if (this.#isValidMoney(money))
        console.log("can't withdraw more than your balance");
      else console.log("please write a valid value");
    }
  };

  #exit = () => {
    console.log("thanks for uisng our ATM");
    readline.close();
    this.#keepRunning = false;
  };
}

const atm = new ATM();
atm.main();
