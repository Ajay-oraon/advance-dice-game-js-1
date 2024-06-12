// select all the elements
const listOfAllDice = document.querySelectorAll(".die"); // get all the die box elements, where it displays the die values
const scoreInputs = document.querySelectorAll("#score-options input") // get all the scores radio inputs
const scoreSpans = document.querySelectorAll("#score-options span"); // get all the score spans, which will be used to display the score of that input

const currentRoundText = document.getElementById("current-round"); // element that displays the current round number
const currentRoundRollsText = document.getElementById("current-round-rolls") // element that displays the total amount of rolls made in the current round
 
const totalScoreText = document.getElementById("total-score"); // element to display all scors from all rounds
const scoreHistory = document.getElementById("score-history"); // element to list all the scores from all the previous rounds, along with also saying what score was selected
 
const rollDiceBtn = document.getElementById("roll-dice-btn"); // button to roll the dice, and display the dice values in the .die elements
const keepScoreBtn = document.getElementById("keep-score-btn"); // button to keep score, from the radio buttons that was selected.

const rulesContainer = document.querySelector(".rules-container"); // container that has all the rules of the games
const rulesBtn = document.getElementById("rules-btn"); // button to toggle the rules container

// initial state variables
let isModalShowing = false; // variable to keep track whether or not the modal should be visible or not - the rules container

let diceValuesArr = []; // the array of all the dice values, when rolled
let rolls = 0; // current rolls for this round
// let score = 0; // not sure what this is used for yet
let totalScore = 0; // all the round scores combined
let round = 1; // the current round

// roll dice when user press roll dice button. This gets 5 random numbers between 1 and 6, both included.
const rollDice = () => {
  diceValuesArr = []; // array to keep track of all the dice values. Set array to be empty
  for (let i = 0; i < 5; i++) { // for loop, get 5 random dices
    const randomDice = Math.floor(Math.random() * 6) + 1; // in range 1 - 6, both included
    diceValuesArr.push(randomDice); // push the value to diceValuesArr
  }
  listOfAllDice.forEach((dice, index) => { // loop throuh all dice elements
    dice.textContent = diceValuesArr[index]; // put in the corresponding dice value that has the same index, as the textContent
  })
}
// function to update UI stats.
const updateStats = () => {
  currentRoundRollsText.textContent = rolls; // set the current round rolls textContent to rolls;
  currentRoundText.textContent = round; // set current round element textContent to round;
}

// function to update specific radio option input, along with putting in the score inside the corresponding span 
const updateRadioOption = (optionNode, score) => { 
  scoreInputs[optionNode].disabled = false // enable the targeted radio, to make it selectable
  scoreInputs[optionNode].value = score;  // set the value of ot the radio to be the score.

  scoreSpans[optionNode].textContent = `, score = ${score}` // 
}

// function to update the score of the player
const updateScore = (selectedValue, achieved) => { 
  totalScore += parseInt(selectedValue); // add the score to the totalScore
  totalScoreText.textContent = totalScore; // update the textContent of totalScoreText to be the new totalScore
  scoreHistory.innerHTML += `<li>${achieved} :${selectedValue}</li>` // append an <li> element with the achieved (the type of score, for example "three-of-kind"), and score to the score history. 
}

// function to check if the rolled dices are "three-of-kind" or "four-of-kind", along with updating the radio options accordingly.
const getHighestDuplicates = (arr) => {
  const counts = {}; // store the total count for each dice value
  for (const num of arr) { // for loop to iteratae through the array, and update the count dictionary
    if (counts[num]) { // if the key already exist, and it has a value, increment it by one
      counts[num]++;
    } else { // else, set it to one, as it doesn't exist yet.
      counts[num] = 1;
    }
  }

  let highestCount = 0; // variable to store the highest count in the array
  3, 4, 5, 2, 3, 3, 5
  for (const num of arr) { // iterate through the array.
    const count = counts[num]; // get the current count value
    if (count >= 3 && count > highestCount) { // if count is bigger or equal to 3, and it is bigger than the current highest count, set the highest count to this count, as it is bigger.
      highestCount = count;
    }
  }

  const sumOfAllDice = diceValuesArr.reduce((a, b) => a + b, 0); // get the sum of all the dices values added together
  if (highestCount >= 4) { // if highest count is bigger or equal to four, set "4 of kind" to active
    updateRadioOption(1, sumOfAllDice);
  }
  if (highestCount >= 3) { // if highest count is bigger or equal to four, set "3 of kind" to active
    updateRadioOption(0, sumOfAllDice);
  }
}

// function to detect whether or not the array has 3 of a kind, and 2 of a kind.
const detectFullHouse = (arr) => {
  const counts = {}; // dictionary to store the total counts for each element
  for (const num of arr) { // iterate through all the items in the array
    counts[num] = counts[num] ? counts[num] + 1 : 1; // set the count[item] to be item + 1 if it already exists, else set it to 1
  }
  const hasThreeOfAKind = Object.values(counts).includes(3); // see if counts dictionary values have 3.
  const hasPair = Object.values(counts).includes(2); // see if counts dictionary values has 2
  if (hasThreeOfAKind && hasPair) { // if it has three of a kind and two of a kind, update radio option to have full house active
    updateRadioOption(2, 25);
  }
}

const checkForStraights = (arr) => { // check if the array have consecutive values, for example: "1, 2, 3, 4, 5"
  const sortedNumbersArr = arr.sort((a, b) => a - b); // sort the array in ascending order. If a - b is a positive, put b before a. If a - b is a negative, put a in front of b. Else if it is 0, keep the positions the exact same.
  const uniqueNumbersArr = Array.from(new Set(sortedNumbersArr)); // create a set to remove duplicates, and turn it back to an array by spreading it in. // 
  const uniqueNumbersStr = uniqueNumbersArr.join(""); // turn the unique numbers array to a string, with no separator
  const smallStraightsArr = ["1234", "2345", "3456"]; // all the possible values for it to be a small straight array (4 consecutive numbers)
  const largeStraightsArr = ["12345", "23456"]; // all possible values for it to be a large straights array (5 consecutive values)
  for (const straight of smallStraightsArr) { // iterate through all the possible small straights array - 4 of a kind
    if (uniqueNumbersStr.includes(straight)) { // if the unique number string (a length of 5) includes the straight, set the radio option "small straight" to active
      updateRadioOption(3, 30);
      break; // break out of the loop
    }
  }
  if (largeStraightsArr.includes(uniqueNumbersStr)) { // if large straights array includes the uniqe numbser string, set "large straight" radio option to active
    updateRadioOption(4, 40);
  }
}

// Function reset radio options. Disable all score radio inputs, set "checked" to false, and set the span text to an empty string for each radio span, to remove the scores next to it.
const resetRadioOption = () => { 
  scoreInputs.forEach(input => {
    input.disabled = true;
    input.checked = false;
  })
  scoreSpans.forEach(span => {
    span.textContent = "";
  })
}

// function to reset entire game.
const resetGame = () => {
  // set state values to default
  diceValuesArr = [0, 0, 0, 0, 0];
  score = 0;
  totalScore = 0;
  round = 1;

  // set all dice box elements textContent to 0
  listOfAllDice.forEach((dice, index) => {
    dice.textContent = diceValuesArr[index];
  });

  totalScoreText.textContent = totalScore; // set total score textContent to 0;
  scoreHistory.innerHTML = "";  // reset the scoreHistory, by removing all the <li> elements.
  currentRoundRollsText.textContent = rolls; // set current round rolls element textContent to empty string.
  currentRoundText.textContent = round; // set current round element textContent to 1;
  resetRadioOption(); // reset all radio options, by disabling and setting checked for each radio to false, along with setting all the spans next to the radio inputs to an empty string, that contain the scores.
}

// add click event listener for roll dice button.
rollDiceBtn.addEventListener("click", () => {
  if (rolls === 3) { // if the roles is 3 for the current round, show alert telling user that they reached max amount of rolls for this round
    alert("You have made three rolls this round. Please select a score.")
  } else {
    // increment the roles by 1;
    rolls++;
    resetRadioOption(); // reset radio options
    rollDice(); // roll Dice, and set the dice items text to dice values
    updateStats(); // update current round and text on UI.
    getHighestDuplicates(diceValuesArr); // handle "three of a kind" and "four of a kind"
    detectFullHouse(diceValuesArr); // handle "full house" - which is "3 of a kind" and "2 of a kind" at once
    checkForStraights(diceValuesArr); // handle "small small straighs" and "large straights"
    updateRadioOption(5, 0); // regardless, set "none of the above" to active
  }
})

// add click event listener for rules button, to toggle rules container
rulesBtn.addEventListener("click", () => {
  // toggle isModalShowing Variable
  isModalShowing = !isModalShowing;
  if (isModalShowing) { //  if isModalShowing, set rulesBtn text to "Hide Rules", and set rules container display to block, to make it visible
    rulesBtn.textContent = "Hide Rules";
    rulesContainer.style.display = "block";
  } else { // else - isModalShowing is false: set rulesBtn text to "Show Rules", and set the display to none to hide the rules container
    rulesBtn.textContent = "Show Rules";
    rulesContainer.style.display = "none";
  }
});

// add click event listener for keep score button, to handle keeping score and going to the next round.
keepScoreBtn.addEventListener("click", () => {
  let selectedValue; // variable to keep track of the selected radio's input valud, which is used to keep track of the score.
  let achieved; // variable to keep track of the id of the selected radio input value, to describe the type of selected radio - for example: "three of a kind".

  for (const radioButton of scoreInputs) { // iterate through all of the scoreInputs
    if (radioButton.checked) { // if the radio input is checked, set selectedValue to the radio value, and achieved to radio id.
      selectedValue = radioButton.value;
      achieved = radioButton.id;
      break; // break out of the loop
    }
  }
  if (selectedValue) { // if there is a selected value, meaning the player has selected a radio option.
    rolls = 0; // reset rolls to 0 for next round 
    round++; // go to next round
    updateStats(); // update rolls and rounds text on UI
    resetRadioOption(); // reset all radio options
    updateScore(selectedValue, achieved); // update total score, and add <li> item to scoreHistory
    if (round > 6) { // if round is bigger than 6, the game is over
      setTimeout(() => { // wait for 500 miliseconds, and show an alert
        alert(`Game Over! Your total score is ${totalScore}`) // alert telling user that round is over
        resetGame(); // reset the game entirely
      }, 500)
    }
  } else { // else, the user pressed the keep score button without selecting any radio input. Alert user to select option or rol dice to get options
    alert("Please select an option or roll the dice")
  }
})
