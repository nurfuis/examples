const textInput = document.getElementById("textInput");
const submitButton = document.getElementById("submitButton");
const outputBox = document.getElementById("outputBox");

submitButton.addEventListener("click", handleInput);
textInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    handleInput();
  }
});


function handleInput() {
  const inputValue = textInput.value;
  const parsedValue = parseInt(inputValue, 10);

  let output = "You entered: " + parsedValue;

  if (!isNaN(parsedValue)) {
    const result = calculateSquareRoot(parsedValue);
    output += "\nThe answer is:" + result;

  } else {
    output += "\nInvalid input: Please enter a number.";
    
  }

  outputBox.textContent = output;
}


function calculateSquareRoot(input) {
  if (Number.isInteger(input)) {
    return Math.sqrt(input);
  } else {
    return "Input is not an integer";
  }
}


function sqrt(x) {
  function improve(guess) {
    return (guess + x / guess) / 2;
  }

  function goodEnough(guess) {
    return Math.abs(guess * guess - x) < 0.001;
  }

  function tryGuess(guess) {
    if (goodEnough(guess)) {
      return guess;
    } else {
      return tryGuess(improve(guess));
    }
  }

  return tryGuess(1);
}
