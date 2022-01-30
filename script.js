document.addEventListener("DOMContentLoaded", () => { // When HTML Is Loaded
    createSquares();

    // Variables
    let guessedWords = [[]];
    let availableSpace = 1;
    let guessedWordCount = 0;
    let darkMode = false;

    // DOM Elements

    const keys = document.querySelectorAll(".keyboard-row button");
    const messageText = document.getElementById("messageText");
    const closeBtn = document.getElementById("closeBtn");
    const settingsEl = document.getElementById('settings');
    const darkSwitch = document.getElementById("darkSwitch");
    const settingsBtn = document.getElementById("settingsBtn");
    const stylesheet = document.getElementById("stylesheet");
    const statsBtn = document.getElementById("statsBtn");
    const statsEl = document.getElementById("stats");
    const statsClose = document.getElementById("statsClose");
    const winsEl = document.getElementById("stats1");
    const lossesEl = document.getElementById("stats2");
    const percentWinEl = document.getElementById("stats3");
    const playedEl = document.getElementById("stats4");
    const infoButton = document.getElementById("infoBtn");
    const infoEl = document.getElementById("info");
    const infoClose = document.getElementById("infoClose");


    // Generates New Word

    function getNewWord() {
      let wordNum = Math.floor(Math.random() * (WordList.length - 0 + 1)) + 0;
      let word = WordList[wordNum];
      return word;
    };

    // List Of Current Word Letters

    function getCurrentWordArr() {
        const numberOfGuessedWords = guessedWords.length;
        return guessedWords[numberOfGuessedWords - 1];
    };

    // Get New Word

    let word = getNewWord();

    // Check Theme Stored In Local Storage And Set The Display To It
    localStorage.getItem('theme') ? stylesheet.setAttribute('href', localStorage.getItem('theme')) : localStorage.setItem('theme', './light.css');

    // Update Display When Letter Clicked

    function updateGuessedWords(letter) {
        const currentWordArr = getCurrentWordArr();
    
        if (currentWordArr && currentWordArr.length < 5) {
          currentWordArr.push(letter);
    
          const availableSpaceEl = document.getElementById(String(availableSpace));
    
          availableSpace = availableSpace + 1;
          availableSpaceEl.textContent = letter;
          // Set The Right Colors And Animations
          availableSpaceEl.style = `border-color: var(--on-input-border);`;
          availableSpaceEl.style.setProperty('--animate-duration', '.5s');
          availableSpaceEl.classList.add('animate__pulse');
        };
    };
    

    // Show Messgae At Top Of Screen
    
    function showMessage(text) {
      messageText.innerText = text;
      // Add Animation Classes
      messageText.classList.add("animate__animated");
      messageText.classList.add("animate__rubberBand");
      messageText.style.display = "table";
    };


    // Check For Double Letters
    function isLetterInWord(letter, word, input) {
      for (let i = 0; i < word.length; i++) {
        if (letter === word.charAt(i) && word.charAt(i) === input[i]) {
          return true;
        };
      };
      return false;
    };

    // Check Letter Pos And Return Correct Color

    function getTileColor(letter, index,  word, input) {
        let countList = [];
        let repeats = {};
        const letterInThatPosition = word.charAt(index);
        const isCorrectPosition = letter === letterInThatPosition;
        const isCorrectLetter = word.includes(letter) && !isLetterInWord(letter, word, input);

        for (let i = 0; i < input.length; i++) {
          if (countList.includes(input.charAt(i))) {
            repeats[input.charAt(i)] = i;
          }
          countList.push(input.charAt(i));
        };

        if (repeats.hasOwnProperty(letter) && isCorrectLetter) {
          if (repeats[letter] > index) {
            for (let i = 0; i < keys.length; i++) {
              if (letter === keys[i].innerText.toLowerCase()) {
                keys[i].style.backgroundColor = "var(--wrong-place-letter)"
              };
            };
            return "var(--wrong-place-letter)"
          } else {
            for (let i = 0; i < keys.length; i++) {
              if (letter === keys[i].innerText.toLowerCase()) {
                keys[i].style.backgroundColor = "var(--incorect-letter)"
              };
            };
            return "var(--incorect-letter)"
          }
        };

        // Corect Letter In Correct Spot
    
        if (isCorrectPosition) {
          for (let i = 0; i < keys.length; i++) {
            if (letter === keys[i].innerText.toLowerCase()) {
              keys[i].style.backgroundColor = "var(--correct-letter)"
            };
          };
          return "var(--correct-letter)"

          // Letter Is In Word At Wrong Spot

        } else if (isCorrectLetter) {
          for (let i = 0; i < keys.length; i++) {
            if (letter === keys[i].innerText.toLowerCase()) {
              keys[i].style.backgroundColor = "var(--wrong-place-letter)"
            };
          };
          return "var(--wrong-place-letter)"
        };

        // Not In Word

        if (!isCorrectLetter) {
          for (let i = 0; i < keys.length; i++) {
            if (letter === keys[i].innerText.toLowerCase()) {
              keys[i].style.backgroundColor = "var(--incorect-letter)"
            };
          };
          return "var(--incorect-letter)"
        };
      };
      

    // Save Wins In Browser

    function browserWinsCount() {
      localStorage.getItem('wins') ? null : localStorage.setItem('wins', 0);
      let wins = Number(localStorage.getItem('wins'));
      let winsPls1 = wins += 1;
      localStorage.setItem('wins', winsPls1);
    };

    // Save Losses In Browser

    function browserLossesCount() {
      localStorage.getItem('losses') ? null : localStorage.setItem('losses', 0);
      let losses = Number(localStorage.getItem('losses'));
      let lossesPls1 = losses += 1;
      console.log(lossesPls1)
      localStorage.setItem('losses', String(lossesPls1));
    };

    async function handleSubmitWord() {
        const currentWordArr  = getCurrentWordArr();
        if (currentWordArr.length != 5) {
            showMessage("Must Be Five Letters");
            return;
        };

        // See If Word Is Valid With Merriam Webster API

        let res = await fetch(`https://dictionaryapi.com/api/v3/references/sd3/json/${currentWordArr}?key=930fd199-60e3-4396-bc16-9cd4ccc8c4b0`);
        let response = await res.json();
        let resOne = response[0]; 
        try {
          resOne.def;
        } catch (error) {
          showMessage("Not In Word List");
          return;
        };

        const currentWord = currentWordArr.join('');

        // Flipping Animation

        const firstLetterId = guessedWordCount * 5 + 1;
        const interval = 200;
        currentWordArr.forEach((letter, index) => {
          setTimeout(() => {
            const tileColor = getTileColor(letter, index, word, currentWord);

            const letterId = firstLetterId + index;
            const letterEl = document.getElementById(letterId);
            letterEl.classList.add("animate__flipInX");
            letterEl.style = `background-color:${tileColor};border-color:${tileColor};color: var(--square-text-filled);`;
          }, interval * index);
        });

        guessedWordCount += 1;

        // See If You Win Or Lose

        if (currentWord === word) {
            showMessage("You Win!");
            browserWinsCount();
        };

        if (guessedWords.length === 6 && !(currentWord === word)) {
            showMessage(`You Lose, The Word Is ${word}`);
            browserLossesCount();
        };

        guessedWords.push([]);
    };

    // Create Game Squares

    function createSquares() {
        const gameBoard = document.getElementById("board");
        gameBoard.innerHTML = ''
        for (let index = 0; index < 30; index++) {
            let square = document.createElement("div");
            square.classList.add("square");
            square.classList.add("animate__animated");
            square.setAttribute("id", index + 1);
            gameBoard.appendChild(square);
        };
    };

    // When Del Clicked

    function handleDeleteLetter() {
        const currentWordArr = getCurrentWordArr();
        if (currentWordArr.length === 0) {
          return;
        };
        const removedLetter = currentWordArr.pop();

        if (messageText.style.display === "table") {
          messageText.style.display = "none";
        };
    
        guessedWords[guessedWords.length - 1] = currentWordArr;
    
        const lastLetterEl = document.getElementById(String(availableSpace - 1));
        lastLetterEl.style.setProperty('border-color', 'var(--square-border)')
    
        lastLetterEl.textContent = "";
        availableSpace = availableSpace - 1;
      };

    // Save The Last Selected Theme In Local Storage
    function saveTheme(theme) {
      localStorage.setItem('theme', theme)
    }


    // Main Function
    // Checks When Keys Are Pressed
    
    async function main() {
        for (let i = 0; i < keys.length; i++) {
            keys[i].onclick = ({ target }) => {
              const letter = target.getAttribute("data-key");
    
              if (letter === 'enter') {
                  handleSubmitWord();
                  return;
              };

              if (letter === "del") {
                handleDeleteLetter();
                return;
              };
    
              updateGuessedWords(letter);
            };
        };
    };

    // Close And Save Settings

    closeBtn.addEventListener("click", () => {
      settingsEl.style.display = "none";
      let darkValue = darkSwitch.checked;
      darkMode = darkValue;
      if (darkMode) {
        stylesheet.setAttribute('href', 'styles.css');
        saveTheme('./styles.css');
      } else {
        stylesheet.setAttribute('href', 'light.css');
        saveTheme('./light.css')
      };
    });

    // Open Settings

    settingsBtn.addEventListener("click", () => {
      settingsEl.style.display = 'block';
      if (localStorage.getItem('theme') === "styles.css") {
        darkSwitch.checked = "true";
      };
    });

    // Open Stats Menu And Fill Out Info

    statsBtn.addEventListener("click", () => {
      localStorage.getItem('wins') ? winsEl.innerText = localStorage.getItem('wins') : winsEl.innerText = "0"
      localStorage.getItem('losses') ? lossesEl.innerText = localStorage.getItem('losses') : lossesEl.innerText = "0"
      let percentage = Math.round((winsEl.innerText / lossesEl.innerText) * 100)
      if (!(percentage)) {
        percentage = "0"
      } else if (percentage > 100) {
        percentage = 100
      }
      percentWinEl.innerText = String(parseInt(percentage)) + " %"
      playedEl.innerText = String(Number(lossesEl.innerText) + Number(winsEl.innerText))
      statsEl.style.display = "grid";
    });

    // Close Stats Meu

    statsClose.addEventListener("click", () => {
      statsEl.style.display = "none";
    });

    // Open How To Play Screen
    infoButton.addEventListener("click", () => {
      infoEl.style.display = "block";
    });

    // Close How To Play
    infoClose.addEventListener("click", () => {
      infoEl.style.display = "none";
    });

    // Run Main Function

    main();
  });