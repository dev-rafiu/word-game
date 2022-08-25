import Data from "./data.js";

window.addEventListener("DOMContentLoaded", () => {
  getAlphabets();
  getEmptyBoxes();
});

//start game button to start game
const splashScreen = document.querySelector(".splash-screen");
const startGameBtn = document.querySelector(".start-btn");
const outerBar = document.querySelector(".outer-progress-bar");
const innerBar = document.querySelector(".inner-progress-bar");
function startGame(seconds) {
  outerBar.style.display = "block";
  let percentage = 0;
  let interval = setInterval(() => {
    innerBar.style.width = percentage + "%";
    percentage += 1;
    if (percentage >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        splashScreen.classList.add("hide");
        outerBar.style.display = "none";
      }, 1000);
    }
  }, (seconds * 1000) / 100);
}
startGameBtn.addEventListener("click", () => {
  startGame(3);
});

const mixedWordContainer = document.querySelector(".mixed-word-container");
const emptyBoxesContainer = document.querySelector(".empty-boxes-container");
const numberOfLevels = document.querySelector(".total-number");
const score = document.querySelector(".score");

let currentScore = 0;
score.innerText = currentScore;

let currentItem = 0;
let words = Data;

//===============
const easyCategory = words.filter((word) => word.difficultyLevel === "easy");
// ===============

//===============
const intermediateCategory = words.filter(
  (word) => word.difficultyLevel === "intermediate"
);
// ===============

//===============
const hardCategory = words.filter((word) => word.difficultyLevel === "hard");
// ===============

let initialWord = words[currentItem].wrongWord.split("");
const currentLevel = document.querySelector(".level-number");
currentLevel.innerText = currentItem + 1;
numberOfLevels.innerText = words.length;

/*function gets word from wordObjects and returns each alphabet inside of an element*/
function getAlphabets() {
  const mixedAlphabets = initialWord
    .map((char) => {
      return `<div class="alphabet flex" draggable="true">${char}</div>`;
    })
    .join("");
  mixedWordContainer.innerHTML = mixedAlphabets;

  const alphabets = document.querySelectorAll(".alphabet");

  alphabets.forEach((alphabet) => {
    alphabet.addEventListener("dragstart", () => {
      alphabet.classList.add("dragging");
    });

    alphabet.addEventListener("dragend", () => {
      alphabet.classList.remove("dragging");
    });
  });
}
//end of function

/*function creates empty boxes based on current word*/
function getEmptyBoxes() {
  const emptyBoxes = initialWord
    .map(() => {
      return `<div class="empty-box flex"></div>`;
    })
    .join("");
  emptyBoxesContainer.innerHTML = emptyBoxes;
  const boxes = document.querySelectorAll(".empty-box");
  boxes.forEach((emptyBox) => {
    emptyBox.addEventListener("dragover", (e) => {
      const containsElement = emptyBox.querySelector(".alphabet");
      emptyBox.classList.add("dragover");
      containsElement ? null : e.preventDefault();
    });

    emptyBox.addEventListener("dragleave", (e) => {
      emptyBox.classList.remove("dragover");
    });

    emptyBox.addEventListener("drop", () => {
      const element = document.querySelector(".dragging");
      emptyBox.append(element);
      element.removeAttribute("draggable");
      emptyBox.classList.remove("dragover");
    });
  });
}
//end of function

function reset(category) {
  currentScore = 0;
  score.innerText = currentScore;
  words = category;
  currentItem = 0;
  currentLevel.innerText = currentItem + 1;
  numberOfLevels.innerText = words.length;
  initialWord = category[currentItem].wrongWord.split("");
  getAlphabets();
  getEmptyBoxes();
}

const filterBtns = document.querySelectorAll(".filter-btn");
filterBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    filterBtns.forEach((btn) => {
      btn.classList.remove("active");
    });
    e.target.classList.add("active");

    let text = e.target.innerText.toLowerCase();
    if (text === "easy") {
      reset(easyCategory);
    } else if (text === "intermediate") {
      reset(intermediateCategory);
    } else {
      reset(hardCategory);
    }
  });
});

function updateGame(category) {
  let newWord = "";
  const emptyBoxes = document.querySelectorAll(".empty-box");
  emptyBoxes.forEach((emptyBox) => {
    const text = emptyBox.firstChild.innerText;
    newWord += text;
  });
  //==========
  if (newWord === category[currentItem].rightWord.toUpperCase()) {
    currentScore += 5;
    score.innerText = currentScore;
    currentItem += 1;
    if (currentItem === category.length) {
      const modalOverlay = document.querySelector(".modal-overlay");
      const totalScore = modalOverlay.querySelector(".total-score");
      totalScore.innerText = currentScore;
      modalOverlay.classList.add("show-modal");
      const closeBtn = modalOverlay.querySelector(".close-modal");
      closeBtn.addEventListener("click", () => {
        modalOverlay.classList.remove("show-modal");
      });
    }
    initialWord = category[currentItem].wrongWord.split("");
    currentLevel.innerText = currentItem + 1;
    getAlphabets();
    getEmptyBoxes();
  } else {
    getAlphabets();
    getEmptyBoxes();
  }
}

const submitBtn = document.querySelector(".submit-btn");
submitBtn.addEventListener("click", () => {
  if (mixedWordContainer.childNodes.length === 0) {
    updateGame(words);
  }

  if (mixedWordContainer.childNodes.length === 0 && words == easyCategory) {
    updateGame(easyCategory);
  }

  if (
    mixedWordContainer.childNodes.length === 0 &&
    words == intermediateCategory
  ) {
    updateGame(intermediateCategory);
  }
  if (mixedWordContainer.childNodes.length === 0 && words == hardCategory) {
    updateGame(hardCategory);
  }
});
