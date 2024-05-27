const passwordDisplay = document.querySelector("[passwordDisplay]");

const copyBtn = document.querySelector("[dataCopy]");

const copyMsg = document.querySelector("[CopyMessage]");

const lengthNumberDisplay = document.querySelector("[lengthNumber]");

const inputSlider = document.querySelector("[lengthSlider]");

const upperCaseCheck = document.querySelector("#upperCase");

const lowerCaseCheck = document.querySelector("#lowerCase");

const numbersCheck = document.querySelector("#numbers");

const symbolsCheck = document.querySelector("#symbols");

const allCheckBox = document.querySelectorAll("input[type=checkbox]");

const strengthIndicator = document.querySelector("[strengthIndicator]");

const generateButton = document.querySelector("[generateButton]");

let password = "";

let passwordLength = 10;

let checkCount = 0;

// let strengthCircleColor = "grey";

// Flow

// deciding length -> what to include -> generate password ->show password -> strength check and color change -> copy

//
//
//
//
//
//
//
//

// Set default password length
handleSlider();

function handleSlider() {
	inputSlider.value = passwordLength;
	lengthNumberDisplay.innerText = passwordLength;

	// to handle the size of background filled with gradient

	const min = inputSlider.min;
	const max = inputSlider.max;

	inputSlider.style.backgroundSize =
		((passwordLength - min) * 100) / max - min + "% 100%";
}

// To change password length when we move slider
inputSlider.addEventListener("input", (e) => {
	passwordLength = e.target.value;
	handleSlider();
});

//
//
//
//
//
//
//
//

// set default color to gray
setIndicator("#ccc");

// Set color of the strength indicator
function setIndicator(color) {
	strengthIndicator.style.backgroundColor = color;
	strengthIndicator.style.boxShadow = `0 0 15px ${color}`;
}

// Calculating strength of password
function calcPasswordStrength(password) {
	let hasUpper = false,
		hasLower = false,
		hasSymbol = false,
		hasNumber = false;

	if (upperCaseCheck.checked) hasUpper = true;
	if (lowerCaseCheck.checked) hasUpper = true;
	if (numbersCheck.checked) hasUpper = true;
	if (symbolsCheck.checked) hasUpper = true;

	if (
		hasUpper &&
		hasLower &&
		(hasNumber || hasSymbol) &&
		passwordLength >= 8
	) {
		setIndicator("#0f0");
	} else if (
		(hasLower || hasUpper) &&
		(hasNumber || hasSymbol) &&
		passwordLength >= 6
	) {
		setIndicator("#ff0");
	} else {
		setIndicator("#f00");
	}
}

//
//
//
//
//
//
//
//
//
//

// How many checkbox are checked

function handleCheckBoxChange(Event) {
	checkCount = 0;
	allCheckBox.forEach((checkbox) => {
		if (checkbox.checked) {
			checkCount++;
		}
	});

	// Special Condition
	if (passwordLength < checkCount) {
		passwordLength = checkCount;
		handleSlider();
	}
}

allCheckBox.forEach((checkbox) => {
	checkbox.addEventListener("change", (e) => {
		handleCheckBoxChange(Event);
	});
});

//
//
//
//
//
//
//
//
//

// Generate random integer within [min,max)
function getRandomInteger(min, max) {
	return Math.floor(Math.random() * (max - min)) + min; // took floor as there's a possibilty to get a floating number
}

// generate random number btw 0 to 9
function generateRandomNumber() {
	return getRandomInteger(0, 9);
}

// generate random lower case letter
function generateRandomLowerCase() {
	return String.fromCharCode(getRandomInteger(97, 123));
}

// generate random lower case letter
function generateRandomUpperCase() {
	return String.fromCharCode(getRandomInteger(65, 91)); // to generate character from ASCII value
}

// generate random symbol
const symbol = "!@#$%^&*()_+-={}[]:;\"'|<,>.?/";

function generateRandomSymbol() {
	return symbol.charAt(getRandomInteger(0, symbol.length));
}

//
//
//
//
//
//
//
//
//
//

// To copy content

async function copyContent() {
	try {
		await navigator.clipboard.writeText(passwordDisplay.value);
		copyMsg.innerHTML = "Copied";
	} catch (e) {
		copyMsg.innerHTML = "Failed";
	}

	copyMsg.classList.add("active");

	setTimeout(() => {
		copyMsg.classList.remove("active");
	}, 2000);
}

// To copy content when we click on copy button if password block is non empty
copyBtn.addEventListener("click", () => {
	if (passwordDisplay.value) {
		copyContent();
	}
});

//
//
//
//
//
//
//
//
//
//

// Generating Password

generateButton.addEventListener("click", (e) => {
	// If someone hit generate button as soon as page loaded
	if (upperCaseCheck.checked && checkCount == 0) {
		password = "";

		for (let i = 0; i < passwordLength; i++)
			password += generateRandomUpperCase();

		// Showing generated password
		passwordDisplay.value = password;

		// calculating strength of password
		calcPasswordStrength(passwordDisplay.value);

		return;
	}

	if (checkCount == 0) return;

	// to ensure if length is decreased after checking the required box
	if (passwordLength < checkCount) {
		passwordLength = checkCount;
		handleSlider();
	}

	// remove old password
	password = "";

	// Created a array of function to randomly call any function to fill up remaining places randomly
	let funcArr = [];

	if (upperCaseCheck.checked) {
		funcArr.push(generateRandomUpperCase);
	}
	if (lowerCaseCheck.checked) {
		funcArr.push(generateRandomLowerCase);
	}
	if (numbersCheck.checked) {
		funcArr.push(generateRandomNumber);
	}
	if (symbolsCheck.checked) {
		funcArr.push(generateRandomSymbol);
	}

	// let's put necessary stuff first as we need to put one character of each type of checked types

	for (let i = 0; i < funcArr.length; i++) {
		password += funcArr[i]();
	}

	// let's fill up remaining space

	for (let i = 0; i < passwordLength - funcArr.length; i++) {
		let randIndex = getRandomInteger(0, funcArr.length);
		password += funcArr[randIndex]();
	}

	// Shuffing the password show that its order of character doesn't remain same each time

	password = shufflePassword(Array.from(password));

	// Showing generated password
	passwordDisplay.value = password;

	// calculating strength of password
	calcPasswordStrength(passwordDisplay.value);
});

// Shuffling Password

function shufflePassword(array) {
	// Fisher Yales Method

	for (let i = password.length - 2; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		const temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}

	let str = "";
	array.forEach((el) => {
		str += el;
	});
	return str;
}
