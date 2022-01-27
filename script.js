document.addEventListener("DOMContentLoaded", () => {
    createSquares();

    let guessedWords = [[]];
    let availableSpace = 1;
    let guessedWordCount = 0;


    const keys = document.querySelectorAll(".keyboard-row button");
    const messageText = document.getElementById("messageText");
    const closeBtn = document.getElementById("closeBtn");
    const settingsEl = document.getElementById('settings');
    const darkSwitch = document.getElementById("darkSwitch");
    let dark = false

    function getNewWord() {
      let wordNum = Math.floor(Math.random() * (WordList.length - 0 + 1)) + 0;
      let word = WordList[wordNum];
      return word;
    };

    function getCurrentWordArr() {
        const numberOfGuessedWords = guessedWords.length;
        return guessedWords[numberOfGuessedWords - 1];
    };

    const word = getNewWord();

    function updateGuessedWords(letter) {
        const currentWordArr = getCurrentWordArr();
    
        if (currentWordArr && currentWordArr.length < 5) {
          currentWordArr.push(letter);
    
          const availableSpaceEl = document.getElementById(String(availableSpace));
    
          availableSpace = availableSpace + 1;
          availableSpaceEl.textContent = letter;
        };
    };
    
    function showMessage(text) {
      messageText.innerText = text;
      messageText.classList.add("animate__animated");
      messageText.classList.add("animate__rubberBand");
      messageText.style.display = "table";
    };


    function getTileColor(letter, index,  word) {
        const isCorrectLetter = word.includes(letter);
    
        if (!isCorrectLetter) {
          for (let i = 0; i < keys.length; i++) {
            if (letter === keys[i].innerText.toLowerCase()) {
              keys[i].style.backgroundColor = "rgb(58, 58, 60)";
            };
          };
          return "rgb(58, 58, 60)";
        };
    
        const letterInThatPosition = word.charAt(index);
        const isCorrectPosition = letter === letterInThatPosition;
    
        if (isCorrectPosition) {
          for (let i = 0; i < keys.length; i++) {
            if (letter === keys[i].innerText.toLowerCase()) {
              keys[i].style.backgroundColor = "rgb(83, 141, 78)";
            };
          };
          return "rgb(83, 141, 78)";
        } else if (isCorrectLetter) {
          for (let i = 0; i < keys.length; i++) {
            if (letter === keys[i].innerText.toLowerCase()) {
              keys[i].style.backgroundColor = "rgb(181, 159, 59)";
            };
          };
          return "rgb(181, 159, 59)";
        };
      };

    async function handleSubmitWord() {
        const currentWordArr  = getCurrentWordArr();
        if (currentWordArr.length != 5) {
            const gameBoard = document.getElementById("board");
            showMessage("Must Be Five Letters");
            return;
        };

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

        const firstLetterId = guessedWordCount * 5 + 1;
        const interval = 200;
        currentWordArr.forEach((letter, index) => {
          setTimeout(() => {
            const tileColor = getTileColor(letter, index, word);

            const letterId = firstLetterId + index;
            const letterEl = document.getElementById(letterId);
            letterEl.classList.add("animate__flipInX");
            letterEl.style = `background-color:${tileColor};border-color:${tileColor}`;
          }, interval * index);
        });

        guessedWordCount += 1;

        if (currentWord === word) {
            showMessage("You Win!");
        };

        if (guessedWords.length === 6) {
            showMessage("You Lose");
        };

        guessedWords.push([]);
    };

    function createSquares() {
        const gameBoard = document.getElementById("board");
        for (let index = 0; index < 30; index++) {
            let square = document.createElement("div");
            square.classList.add("square");
            square.classList.add("animate__animated");
            square.setAttribute("id", index + 1);
            gameBoard.appendChild(square);
        };
    };

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
    
        lastLetterEl.textContent = "";
        availableSpace = availableSpace - 1;
      };


    
    async function forLoop() {
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

    closeBtn.addEventListener("click", () => {
      settingsEl.style.display = "none";
      let darkValue = document.getElementById("darkSwitch").value
    });

    forLoop();
});