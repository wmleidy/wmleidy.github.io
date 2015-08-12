// a first attempt at an interactive JavaScript game with DOM manipulation
// this should be considered a "first draft" or "minimum viable product"
// refactoring will take place as my knowledge of design principles of
// JavaScript expands

// initializing game, putting variables in global scope
var words = ["abbreviate","abstinence","adulation","adversity","aesthetic","ambivalent","amicable","anachronistic","anecdote","anonymous","antagonist","arid","assiduous","asylum","benevolent","camaraderie","censure","circuitous","clairvoyant","collaborate","compassion","compromise","condescending","conditional","conformist","congregation","convergence","deleterious","demagogue","digression","diligent","discredit","disdain","divergent","empathy","emulate","enervating","enhance","ephemeral","evanescent","exasperation","exemplary","extenuating","florid","fortuitous","frugal","hackneyed","haughty","hedonist","hypothesis","impetuous","impute","incompatible","inconsequential","inevitable","integrity","intrepid","intuitive","jubilation","lobbyist","longevity","mundane","nonchalant","novice","opulent","orator","ostentatious","parched","perfidious","precocious","pretentious","procrastinate","prosaic","prosperity","provocative","prudent","querulous","rancorous","reclusive","reconciliation","renovation","resilient","restrained","reverence","sagacity","scrutinize","spontaneity","spurious","submissive","substantiate","subtle","superficial","superfluous","suppress","surreptitious","tactful","tenacious","transient","venerable","vindicate","wary"];
var theWord = words[Math.floor(Math.random() * words.length)].toUpperCase().split("");
var progress = [];
for (var i = 0; i < theWord.length; i++) {
	progress.push("_");
}
var guessedLetters = [];
var wrongLetters = [];
var wrongGuesses = 0;

// assigning key locations in DOM to variables
var elScaffold = document.getElementById("scaffold");
var elProgress = document.getElementById("progress");
var elWrongLetters = document.getElementById("wrongletters");
var elLetter = document.getElementById("letter");
var elMessage = document.getElementById("message");
var elPlayAgain = document.getElementById("playagain");
var elButton = document.getElementById("button");
var elAnotherGame = document.getElementById("anothergame");
var elInvitation = document.getElementById("invitation");

// initializes game upon load
function initializeGame() {
	elProgress.textContent = progress.toString().replace(/,/g," ");
};

window.onload = initializeGame;

// separate functions needed for game play
function validateLetter(input) {
	if (input < "A" || input > "Z") {
		elMessage.textContent = "Please enter a Latin letter.";
		return false;
	} else if (guessedLetters.indexOf(input) > -1) {
		elMessage.textContent = "You already guessed that letter!";
		return false;
	} else {
		return true;
	}
}

function checkLetter(input) {
	if (theWord.indexOf(input) > -1) {
		elMessage.textContent = "Good guess!";
		for (var i = 0; i < theWord.length; i++) {
			if (input === theWord[i]) {
				progress[i] = input;
			}
		}
	}
	else {
		elMessage.textContent = "Sorry! Letter not found!";
		wrongLetters.push(input);
		wrongGuesses += 1;
	}
}

function displayProgress() {
	elProgress.textContent = progress.toString().replace(/,/g," ");
	elWrongLetters.textContent = "Incorrect guesses: " + wrongLetters.join(", ");
	elScaffold.src = "../images/hangman/hangman" + wrongGuesses.toString() + ".png";
}

function hasGameEnded() {
	if (wrongGuesses === 7) {
		elMessage.innerHTML = "You’ve met a grizzly death... <br /> The word was " + theWord.join("") + ".<br /> Do you know the meaning of this word? If not, click <a href=\"http://dictionary.reference.com/browse/" + theWord.join("") + "\" target=\"_blank\">here</a>."
		elInvitation.textContent = "Want a chance to redeem yourself?";
	}
	else if (theWord.join("") === progress.join("")) {
		elMessage.innerHTML = "Congratulations! You’ve won! <br /> Do you know the meaning of this word? If not, click <a href=\"http://dictionary.reference.com/browse/" + theWord.join("") + "\" target=\"_blank\">here</a>.";
		elInvitation.textContent = "Want to give it another go?";
	} else {
		return;
	}
	elPlayAgain.style.visibility = "visible";
	elButton.disabled = true;
}

function gameTurn() {
	var letter = elLetter.value.toUpperCase();
	elLetter.value = "";
	elLetter.focus();
	if (!validateLetter(letter)) {
		return;                        // "break" instead of "return" here
	};                               // caused me to lose 2 hours of my life
	guessedLetters.push(letter);
	checkLetter(letter);
	displayProgress();
	hasGameEnded();
}

elButton.addEventListener("click", gameTurn, false);

// restarts the game after completion
function resetGame() {
	theWord = words[Math.floor(Math.random() * words.length)].toUpperCase().split("");
	progress = [];
	for (var i = 0; i < theWord.length; i++) {
		progress.push("_");
	}
	guessedLetters = [];
	wrongLetters = [];
	wrongGuesses = 0;

	elScaffold.src  = "../images/hangman/hangman0.png";
	elProgress.textContent = progress.toString().replace(/,/g," ");
	elWrongLetters.textContent = "Incorrect guesses: ";
	elLetter.value = "";
	elLetter.focus();
	elMessage.innerHTML = "";
	elPlayAgain.style.visibility = "hidden";
	elButton.disabled = false;

}

elAnotherGame.addEventListener("click", resetGame, false);