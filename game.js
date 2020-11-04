<<<<<<< HEAD
import { gliderArray, figureEightArray, colorArray } from "/presets.js";

=======
>>>>>>> 7a148c30b2cfeebc1b726d69c5810c0e49aba28f
document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".grid");

  let rows = 20;
  let cols = 20;

  let running = false;
  let generation = 0;
  let generationDisplay = document.querySelector("span");
  let timer;
  let speed = 1500;

  const startBtn = document.getElementById("start-stop");

  let grid = new Array(cols);
  let nextGrid = new Array(cols);

  function createArrs() {
    for (let i = 0; i < cols; i++) {
      grid[i] = new Array(rows);
      nextGrid[i] = new Array(rows);
    }
  }

  function resetArrs() {
    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {
        grid[col][row] = 0;
        nextGrid[col][row] = 0;
      }
    }
  }

  function nextArrs() {
    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {
        grid[col][row] = nextGrid[col][row];
        nextGrid[col][row] = 0;
      }
    }
  }

  // Initialize
  function initGame() {
    createGrid();
    createArrs();
    resetArrs();
    initBtns();
  }

  function createGrid() {
    // let newGrid = grid.fill(new Array(rows.fill(0)));
    const table = document.createElement("table");
    for (let col = 0; col < cols; col++) {
      let tRow = document.createElement("tr");
      for (let row = 0; row < rows; row++) {
        const tData = document.createElement("td");
        tData.setAttribute("id", row + "-" + col);
        tData.classList.add("dead");
        tData.addEventListener("click", (e) => click(tData));
        tRow.appendChild(tData);
      }
      table.appendChild(tRow);
    }
    container.appendChild(table);
  }

  function click(tData) {
    if (running) return;
    const curId = tData.id.split("-");
    // let col, row;
    [col, row] = [curId[0], curId[1]];
    if (tData.classList.contains("dead")) {
      tData.setAttribute("class", "alive");
      grid[col][row] = 1;
    } else {
      tData.setAttribute("class", "dead");
      grid[col][row] = 0;
    }
  }

  function updateClasses() {
    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {
        var tData = document.getElementById(col + "-" + row);
        if (grid[col][row] == 1) {
          tData.setAttribute("class", "alive");
        } else {
          tData.setAttribute("class", "dead");
        }
      }
    }
  }

  function initBtns() {
    // const startBtn = document.getElementById("start-stop");
    startBtn.addEventListener("click", startBtnClick);
    const stepBtn = document.getElementById("step");
    stepBtn.addEventListener("click", stepBtnClick);
    const randomBtn = document.getElementById("random");
    randomBtn.addEventListener("click", randomBtnClick);
  }

  function startBtnClick() {
    // const startBtn = document.getElementById("start-stop");
    if (!running) {
      running = true;
      startBtn.innerHTML = "Stop";
      start();
    } else {
      running = false;
      startBtn.innerHTML = "Start";
      clearTimeout(timer);
    }
  }

  function stepBtnClick() {
    if (running) {
      running = false;
      //   document.getElementById("start-stop").innerHTML = "Start";
      startBtn.innerHTML = "Start";
      clearTimeout(timer);
      step();
    } else {
      step();
    }
  }
  // TODO update!
  function randomBtnClick() {}

  /*
---Actions
*/
  // move game forward one step
  function step() {
    generation++;
    if (running) running = false;
    nextGen();
  }

  function start() {
    generation++;
    nextGen();
    if (running) {
      timer = setTimeout(start, speed);
    }
  }

  function nextGen() {
    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {
        applyRules(col, row);
        // update generation number HTML
        generationDisplay.innerHTML = generation;
      }
    }
    // copy nextGrid to grid, and reset nextGrid
    nextArrs();
    // update all 1 values to have class "alive"
    updateClasses();
  }

  function applyRules(col, row) {
    let neighbors = countNeighbors(col, row);
    // apply game rules to each cell to create nextGrid/generation
    // if neighbors < 2 or > 3 the cell dies
    if (grid[col][row] == 1) {
      neighbors < 2 || neighbors > 3
        ? (nextGrid[col][row] = 0)
        : (nextGrid[col][row] = 1);
    } else if (grid[col][row] == 0 && neighbors == 3) nextGrid[col][row] = 1;

    // if cell is dead and neighbors = 3 the cell becomes alive

    // otherwise cell does not change - do nothing
  }

  function countNeighbors(col, row) {
    let neighbors = 0;
    if (col - 1 >= 0) {
      if (grid[col - 1][row] == 1) neighbors++;
    }
    if (col - 1 >= 0 && row - 1 >= 0) {
      if (grid[col - 1][row - 1] == 1) neighbors++;
    }
    if (col - 1 >= 0 && row + 1 < rows) {
      if (grid[col - 1][row + 1] == 1) neighbors++;
    }
    if (col - 1 >= 0) {
      if (grid[col][row - 1] == 1) neighbors++;
    }
    if (col + 1 < cols) {
      if (grid[col][row + 1] == 1) neighbors++;
    }
    if (col + 1 < rows) {
      if (grid[col + 1][row] == 1) neighbors++;
    }
    if (col + 1 < cols && row - 1 >= 0) {
      if (grid[col + 1][row - 1] == 1) neighbors++;
    }
    if (col + 1 < cols && row + 1 < rows) {
      if (grid[col + 1][row + 1] == 1) neighbors++;
    }
    return neighbors;
  }

  // start game of life!
  initGame();
});
