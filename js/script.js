import Data from "./data.js";

window.addEventListener("DOMContentLoaded", () => {
  getMixedAlphabets();
  getEmptyBoxes();
});

// open and close rules
const rules = document.querySelector(".rules");
const rulesContainer = document.querySelector(".rules-container");
const openRulesBtn = document.querySelector(".expand-btn");
openRulesBtn.addEventListener("click", () => {
  const rulesHeight = rules.getBoundingClientRect().height;
  const rulesContainerHeight = rulesContainer.getBoundingClientRect().height;
  rulesContainerHeight == 0
    ? (rulesContainer.style.height = `${rulesHeight}px`)
    : (rulesContainer.style.height = 0);
});
//================

// click start game button to start game
const startScreen = document.querySelector(".start-screen");
const startGameBtn = document.querySelector(".start-game-btn");
const outerBar = document.querySelector(".outer-progress-bar");

function loadProgressBar(seconds) {
  const innerBar = document.querySelector(".inner-progress-bar");
  outerBar.style.display = "block";
  let percentage = 0;
  let interval = setInterval(() => {
    innerBar.style.width = percentage + "%";
    percentage += 1;
    if (percentage >= 101) {
      clearInterval(interval);
      setTimeout(() => {
        startScreen.classList.add("hide");
        outerBar.style.display = "none";
      }, 1000);
    }
  }, (seconds * 1000) / 100);
}
startGameBtn.addEventListener("click", () => {
  loadProgressBar(3);
});
//=======================

const mixedAlphabetsContainer = document.querySelector(".mixed-word-container");
const emptyBoxesContainer = document.querySelector(".empty-boxes-container");
const numberOfLevels = document.querySelector(".total-number");

let currentScore = 0;
const scoreElement = document.querySelector(".score");
scoreElement.innerText = currentScore;

let currentItem = 0;
let wordObjects = Data;
//===============
const easyCategory = wordObjects.filter(
  (word) => word.difficultyLevel === "easy"
);
// ===============

//===============
const intermediateCategory = wordObjects.filter(
  (word) => word.difficultyLevel === "intermediate"
);
// ===============

//===============
const hardCategory = wordObjects.filter(
  (word) => word.difficultyLevel === "hard"
);
// ===============

let initialWord = wordObjects[currentItem].wrongWord.split("");
const currentLevel = document.querySelector(".level-number");
currentLevel.innerText = currentItem + 1;
numberOfLevels.innerText = wordObjects.length;

/*function gets word from wordObjects and returns each alphabet inside of an element*/
function getMixedAlphabets() {
  const mixedAlphabets = initialWord
    .map((char) => {
      return `<div class="alphabet flex" draggable="true">${char}</div>`;
    })
    .join("");
  mixedAlphabetsContainer.innerHTML = mixedAlphabets;

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
  const dropBoxes = document.querySelectorAll(".empty-box");
  dropBoxes.forEach((emptyBox) => {
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
      // element.removeAttribute("draggable");
      emptyBox.classList.remove("dragover");
    });
  });
}
//end of function

function reset(category) {
  currentScore = 0;
  scoreElement.innerText = currentScore;
  wordObjects = category;
  currentItem = 0;
  currentLevel.innerText = currentItem + 1;
  numberOfLevels.innerText = wordObjects.length;
  initialWord = category[currentItem].wrongWord.split("");
  getMixedAlphabets();
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
    scoreElement.innerText = currentScore;
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
    getMixedAlphabets();
    getEmptyBoxes();
  } else {
    getMixedAlphabets();
    getEmptyBoxes();
  }
}

const submitBtn = document.querySelector(".submit-btn");
submitBtn.addEventListener("click", () => {
  if (mixedAlphabetsContainer.childNodes.length === 0) {
    updateGame(wordObjects);
  }

  if (
    mixedAlphabetsContainer.childNodes.length === 0 &&
    wordObjects == easyCategory
  ) {
    updateGame(easyCategory);
  }

  if (
    mixedAlphabetsContainer.childNodes.length === 0 &&
    wordObjects == intermediateCategory
  ) {
    updateGame(intermediateCategory);
  }
  if (
    mixedAlphabetsContainer.childNodes.length === 0 &&
    wordObjects == hardCategory
  ) {
    updateGame(hardCategory);
  }
});
