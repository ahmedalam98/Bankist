"use strict";

/////////////////////
// Data
/////////////////////

const account1 = {
  owner: "Mohamed Ali",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2,
  pin: 1111,

  movementsDates: [
    "2019-01-18T21:31:17.178Z",
    "2020-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2021-04-01T10:17:24.185Z",
    "2021-05-08T14:11:59.604Z",
    "2022-07-26T17:01:17.194Z",
    "2022-07-28T23:36:17.929Z",
    "2022-08-01T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "de-DE",
};

const account2 = {
  owner: "Ahmed Ibrahim",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2018-11-01T13:15:33.035Z",
    "2018-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2021-02-05T16:33:06.386Z",
    "2021-04-10T14:43:26.374Z",
    "2022-06-25T18:49:59.371Z",
    "2022-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account3 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 3333,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2021-05-27T17:01:17.194Z",
    "2022-07-11T23:36:17.929Z",
    "2022-07-12T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const accounts = [account1, account2, account3];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

//////////////////////////////////////////////////////////////
// Functions

const formatMovementDate = function (date, local) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 3600 * 24));

  const dayPassed = calcDaysPassed(new Date(), date);
  console.log(dayPassed);
  if (dayPassed === 0) return "Today";
  if (dayPassed === 1) return "Yesterday";
  if (dayPassed <= 7) return `${dayPassed} days ago`;

  //this gives same output of the 5 lines above
  return new Intl.DateTimeFormat(local).format(date);
};

// formating currency for different country
const formatCur = function (value, locale, curr) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: curr,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  // first we empty what is alredy there
  containerMovements.innerHTML = "";
  // now we start
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  movs.forEach((mov, i) => {
    const type = mov > 0 ? "deposit" : "withdrawal";

    // get the date of the movement
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);

    //get currency of the user
    const formattedMov = formatCur(mov, acc.locale, acc.currency);

    // Display details about the movement
    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div> 
    <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${formattedMov}</div>
        </div>`;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

// Display Balance ( Total )
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  const formattedMov = formatCur(acc.balance, acc.locale, acc.currency);

  labelBalance.textContent = formattedMov;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, val) => acc + val, 0);

  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, val) => acc + val, 0);
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

// Creating usernames for Login
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};
createUsernames(accounts);

const updateUi = function (acc) {
  // Display movements
  displayMovements(acc);
  // Display balance
  calcDisplayBalance(acc);
  // Display summary
  calcDisplaySummary(acc);
};

// Timer function
const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    // In each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    // When 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = "Log in to get started";
      containerApp.style.opacity = 0;
    }

    // Decrease 1s
    time--;
  };

  // Set time to 5 minutes
  let time = 5 * 60;

  // Call the timer every second
  tick();
  const timer = setInterval(tick, 1000);

  return timer;
};

//////////////////////////////////////
// Event handlers

// Global variables
let currentAccount, timer;

// fake logging in
// currentAccount = account1;
// updateUi(currentAccount);
// containerApp.style.opacity = 1;

// Event handler login
btnLogin.addEventListener("click", function (e) {
  // Prevent form from submitting
  e.preventDefault();
  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `welcome back ${
      currentAccount.owner.split(" ")[0]
    }`;
    // clear input fields
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();
    // display UI
    containerApp.style.opacity = 1;
    // Create current date and time
    const now = new Date();
    const options = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "numeric",
      year: "numeric",
      // weekday: 'long',
    };
    // const locale = navigator.language;
    // console.log(locale);

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // timer
    // first reset timer for different users and logins
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    updateUi(currentAccount);
    console.log("Login seccussful");
  } else labelWelcome.textContent = "wrong data, please insert valid account";
});

// Event handler transfer
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = "";

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUi(currentAccount);
    // Reset timer when user perform a transfer/loan (doing an action)
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

// Loan Button
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);

  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    //setting delay for the bank to perform the loan transaction
    setTimeout(function () {
      // Add movement
      currentAccount.movements.push(amount);

      // Add loan date
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUi(currentAccount);

      // Reset timer when user perform a transfer/loan (doing an action)
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 3000);
  }
  inputLoanAmount.value = "";
});

////////////////// Event handler closing /////////////////////
btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );
    // delete account
    accounts.splice(index, 1);

    //hide ui + Change message
    containerApp.style.opacity = 0;
    labelWelcome.textContent = "Log in to get started";
    // clear input text
    inputCloseUsername.value = inputClosePin.value = "";
  }
});

// Event handler Sort
let sorted = false; // default state
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  // reassign default state
  sorted = !sorted;
});
