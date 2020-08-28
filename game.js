// Preset Grids
import { gliderArray, figureEightArray, colorArray } from "/presets.js";

document.addEventListener("DOMContentLoaded", () => {
  // Global State Variables
  let size = 30;
  let rows = size;
  let cols = size;
  let running = false;
  let generation = 0;
  let colorGeneration = 0;
  let alive = 0;
  let update; // setTimeout(cb, speed)
  let speed = 500; // ms per generation
  let speedDisplay = 5;
  let showGrid = true;
  let displayColor = false;
  let PRESET_GLIDER = false;
  let PRESET_FIGURE = false;

  // Initalize Button Event Listeners
  const startBtn = document.getElementById("start-stop");
  startBtn.addEventListener("click", startBtnClick);
  const stepBtn = document.getElementById("step");
  stepBtn.addEventListener("click", stepBtnClick);
  const randomBtn = document.getElementById("random");
  randomBtn.addEventListener("click", randomBtnClick);
  const slowerBtn = document.getElementById("slower");
  slowerBtn.addEventListener("click", slowerBtnClick);
  const fasterBtn = document.getElementById("faster");
  fasterBtn.addEventListener("click", fasterBtnClick);
  const resetBtn = document.getElementById("reset");
  resetBtn.addEventListener("click", resetBtnClick);
  const smallerBtn = document.getElementById("smaller");
  smallerBtn.addEventListener("click", smallerBtnClick);
  const biggerBtn = document.getElementById("bigger");
  biggerBtn.addEventListener("click", biggerBtnClick);
  const gliderBtn = document.getElementById("glider");
  gliderBtn.addEventListener("click", gliderBtnClick);
  const figureBtn = document.getElementById("figure");
  figureBtn.addEventListener("click", figureBtnClick);
  const gridBtn = document.getElementById("grid");
  gridBtn.addEventListener("click", gridBtnClick);
  const colorBtn = document.getElementById("color");
  colorBtn.addEventListener("click", colorBtnClick);

  // Helper Functions to update HTML with current state info
  function updateGen() {
    document.getElementById("generation").innerHTML = generation;
  }
  function updateAlive() {
    // update HTML with current number of alive cells
    document.getElementById("alive").innerHTML = alive;
  }
  function updateSpeed() {
    document.getElementById("speed").innerHTML = speedDisplay;
  }
  function updateSize() {
    document.getElementById("size").innerHTML = size + "x" + size;
  }
  function updateColor() {
    let span = document.getElementById("colors");
    if (displayColor) {
      span.innerHTML = "ON";
      span.style.color = "green";
    }
    if (!displayColor) {
      span.innerHTML = "OFF";
      span.style.color = "red";
    }
  }
  // initialize empty array to store our 2d array for the grid
  let grid = [];

  function clearArray() {
    grid = [];
  }
  // Create 2d Array to store grid [[col,row],[...]..]
  function buildArray() {
    rows = size;
    cols = size;
    grid = new Array(cols);
    for (let i = 0; i < cols; i++) {
      grid[i] = new Array(rows).fill(0);
    }
  }

  // Initialize col x row size grid
  createGrid();
  function createGrid() {
    buildArray();
    generation = 0;
    document.querySelector("span").innerHTML = generation;
    const gridContainer = document.querySelector(".grid-container");
    gridContainer.innerHTML = "";
    // loop through each column
    for (let col = 0; col < cols; col++) {
      // create new container div for each column
      let divRow = document.createElement("div");
      divRow.classList.add("div-row");
      // loop through each row
      for (let row = 0; row < rows; row++) {
        const cell = document.createElement("div");
        // add preset pattern if selected
        if (PRESET_GLIDER) {
          if (gliderArray[col][row] == 1) {
            cell.setAttribute("id", row + "-" + col);
            cell.classList.add("alive");
            cell.addEventListener("click", (evt) => cellClick(cell));
            // add each new cell to divRow
            divRow.appendChild(cell);
            grid[col][row] = 1;
          } else if (gliderArray[col][row] == 0) {
            // create id for cell with col-row acting liky [x][y] coordinates on the grid
            cell.setAttribute("id", row + "-" + col);
            cell.classList.add("dead");
            cell.addEventListener("click", (evt) => cellClick(cell));
            // add each new cell to divRow
            divRow.appendChild(cell);
          }
        } else if (PRESET_FIGURE) {
          if (figureEightArray[col][row] == 1) {
            cell.setAttribute("id", row + "-" + col);
            cell.classList.add("alive");
            cell.addEventListener("click", (evt) => cellClick(cell));
            // add each new cell to divRow
            divRow.appendChild(cell);
            grid[col][row] = 1;
          } else if (figureEightArray[col][row] == 0) {
            // create id for cell with col-row acting liky [x][y] coordinates on the grid
            cell.setAttribute("id", row + "-" + col);
            cell.classList.add("dead");
            cell.addEventListener("click", (evt) => cellClick(cell));
            // add each new cell to divRow
            divRow.appendChild(cell);
          }
          // Normal empty grid, no preset selected
        } else {
          // create id for cell with col-row acting liky [x][y] coordinates on the grid
          cell.setAttribute("id", row + "-" + col);
          cell.classList.add("dead");
          cell.addEventListener("click", (evt) => cellClick(cell));
          // add each new cell to divRow
          divRow.appendChild(cell);
        }
      }
      // add each divRow to the grid container div
      gridContainer.appendChild(divRow);
    }
    PRESET_GLIDER = false;
    PRESET_FIGURE = false;
  }

  function cellClick(cell) {
    //  do not allow cell to be changed if currently running
    if (running) return;
    // get current id and split into [[col], [row]]
    const curId = cell.id.split("-");
    // destructure out col and row from id
    let [col, row] = [curId[0], curId[1]];
    // if dead make alive
    if (cell.classList.contains("dead")) {
      cell.setAttribute("class", "alive");
      grid[col][row] = 1;
      alive++;
      updateAlive();
    } else {
      // if alive make dead
      cell.setAttribute("class", "dead");
      grid[col][row] = 0;
      alive--;
      updateAlive();
    }
  }

  function startBtnClick() {
    // const startBtn = document.getElementById("start-stop");
    if (!running) {
      running = true;
      startBtn.innerHTML = "Stop";
      start();
    } else {
      // stop the game
      stop();
    }
  }

  // start recursive loop of generations x speed/ms until user stops
  function start() {
    generation++;
    nextGen();
    if (running) {
      update = setTimeout(start, speed);
    }
  }

  function stop() {
    running = false;
    startBtn.innerHTML = "Start";
    clearTimeout(update);
  }

  function stepBtnClick() {
    // if running stop, then step
    if (running) {
      stop();
      generation++;
      nextGen();
    } else {
      // step 1 generation
      generation++;
      nextGen();
    }
  }

  // add random 0/1 values to all cells on grid
  function randomBtnClick() {
    if (running) stop();
    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {
        if (Math.random() + 0.25 > 1) {
          // add 25% random cells
          grid[col][row] = 1;
          document
            .getElementById(col + "-" + row)
            .setAttribute("class", "alive");
          alive++;
        }
      }
    }
  }

  function slowerBtnClick() {
    if (speed < 3500) {
      speed = Math.floor(speed / 0.75);
    }
    if (speedDisplay > 1) {
      speedDisplay--;
      updateSpeed();
    }
  }

  function fasterBtnClick() {
    if (speed > 50) {
      speed = Math.floor(speed / 1.5);
    }
    if (speedDisplay < 10) {
      speedDisplay++;
      updateSpeed();
    }
  }

  // resest grid, generation, num alive
  function resetBtnClick() {
    if (running) stop();
    const aliveCells = document.getElementsByClassName("alive");
    const cellsToUpdate = [];
    for (let i = 0; i < cellsToUpdate.length; i++) {
      cellsToUpdate.push(aliveCells[i]);
    }
    for (var i = 0; i < cellsToUpdate.length; i++) {
      cellsToUpdate[i].setAttribute("class", "dead");
    }
    for (var i = 0; i < rows; i++) {
      for (var j = 0; j < cols; j++) {
        grid[i][j] = 0;
      }
    }
    buildArray();
    createGrid();
    if (showGrid == false) {
      showGrid = true;
      gridBtnClick();
    }
    alive = 0;
    updateAlive();
  }

  // Decrease cols x rows -10
  function smallerBtnClick() {
    if (size >= 20) {
      size -= 10;
      stop();
      clearArray();
      buildArray();
      createGrid();
      updateSize();
      alive = 0;
      updateAlive();
      showGrid = true;
    }
  }
  // Increase cols and rows +10
  function biggerBtnClick() {
    if (size <= 90) {
      size += 10;
      stop();
      clearArray();
      buildArray();
      createGrid();
      updateSize();
      alive = 0;
      updateAlive();
      showGrid = true;
    }
  }

  // Toggle Grid Lines
  function gridBtnClick(evt) {
    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {
        const cell = document.getElementById(row + "-" + col);
        if (showGrid) {
          cell.style.border = "0";
        } else {
          cell.style.border = "0.2px solid black";
        }
      }
    }
    showGrid = !showGrid;
    if (showGrid) {
      document.querySelector(".grid-container").style.border = "0";
    } else {
      document.querySelector(".grid-container").style.border =
        "0.01px solid black";
    }
  }

  // toggle cell color change every 5 generations
  function colorBtnClick() {
    if (displayColor) {
      displayColor = false;
    } else {
      displayColor = true;
    }
    updateColor();
  }

  // calculate the next grid based on the rules of the game
  function nextGen() {
    // reset number of alive cells to zero
    alive = 0;
    // make exact copy of current grid (2d array[][])
    const nextGrid = grid.map((arr) => [...arr]);
    // loop over every cell in grid
    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {
        const cell = grid[col][row];
        // start count number of neighbors for each cell
        let neighbors = 0;
        // loop through a 9x9 grid around each cell (-1, 0, 1)
        //
        // -1,-1 | 0,-1 | 1,-1
        // -1, 0 | 0, 0 | 1, 0
        // -1, 1 | 0, 1 | 1, 1
        //
        for (let x = -1; x < 2; x++) {
          for (let y = -1; y < 2; y++) {
            // set variables for current cell and the x,y positions checking on 9x9 grid
            const curX = col + x;
            const curY = row + y;
            if (x == 0 && y == 0) continue;
            // if not out of bounds of the overall grid (excluding edges as dead zones)
            if (curX >= 0 && curX < cols && curY >= 0 && curY < rows) {
              // check and count current neighbor
              if (grid[curX][curY]) neighbors++;
            }
          }
        } // end neighbor count
        // apply game rules to each cell and modify nextGrid (copy grid)
        // if cell is alive and neighbors < 2 or > 3 the cell dies
        if ((cell == 1 && neighbors < 2) || neighbors > 3)
          nextGrid[col][row] = 0;
        // if cell is alive and neighbors == 2 or == 3 the cell stays alive
        if ((cell == 1 && neighbors == 2) || neighbors == 3)
          nextGrid[col][row] = 1;
        // if cell is dead and neighbors == 3 --> cell becomes alive next gen
        else if (cell == 0 && neighbors == 3) nextGrid[col][row] = 1;
        // otherwise cell stays dead - do nothing
      }
    } // nextGrid is ready to go

    // Final step is to take nextGrid and copy it back
    //  to grid and update the cell classes
    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {
        grid[col][row] = nextGrid[col][row];
        let cell = document.getElementById(col + "-" + row);
        if (nextGrid[col][row] == 1) {
          cell.setAttribute("class", "alive");
          cell.style.background = "black";
          if (displayColor) {
            if (generation > colorGeneration + 5) {
              cell.style.background = colorArray[colorGeneration];
            }
          }
          alive++;
        } else if (nextGrid[col][row] == 0) {
          cell.setAttribute("class", "dead");
          cell.style.background = "white";
          if (displayColor) {
            if (generation > colorGeneration + 5) {
              cell.style.background = "white";
            }
          }
        }
      }
    }
    // update HTML elements for generation and number of alive cells
    if (displayColor) {
      if (generation > colorGeneration + 10) {
        colorGeneration += 5;
        if (colorGeneration > 270) colorGeneration = 0;
      }
    }
    updateGen();
    updateAlive();
  }

  // Preset grid button handlers
  // Glider
  function gliderBtnClick() {
    if (!running) {
      resetBtnClick();
      PRESET_GLIDER = true;
      buildArray();
      createGrid();
      if (showGrid == false) {
        showGrid = true;
        gridBtnClick();
      }
    }
  }
  // Figure 8
  function figureBtnClick() {
    if (!running) {
      resetBtnClick();
      PRESET_FIGURE = true;
      buildArray();
      createGrid();
      if (showGrid == false) {
        showGrid = true;
        gridBtnClick();
      }
    }
  }
});
