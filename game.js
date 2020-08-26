document.addEventListener("DOMContentLoaded", () => {
  // Global State Variables
  let size = 50;
  let rows = size;
  let cols = size;
  let running = false;
  let generation = 0;
  let alive; // TODO display number of alive cells
  let update; // setTimeout(cb, speed)
  let speed = 500; // ms per generation
  let showGrid = true;

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
  const gridBtn = document.getElementById("grid");
  gridBtn.addEventListener("click", gridBtnClick);

  let grid = [];

  // Create 2d Array to store grid [[col,row],[...]..]
  function buildArray() {
    rows = size;
    cols = size;
    console.log(size, cols, rows, grid);
    grid = new Array(cols);
    for (let i = 0; i < cols; i++) {
      grid[i] = new Array(rows).fill(0);
    }
    console.log(grid);
  }

  function clearArray() {
    console.log(grid);

    grid = [];
    console.log(grid);
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
        // create id for cell with col-row acting liky [x][y] coordinates on the grid
        cell.setAttribute("id", row + "-" + col);
        cell.classList.add("dead");
        cell.addEventListener("click", (evt) => cellClick(cell));
        // add each new cell to divRow
        divRow.appendChild(cell);
      }
      // add each divRow to the grid container div
      gridContainer.appendChild(divRow);
    }
  }

  function cellClick(cell) {
    //  do not allow cell to be changed if currently running
    if (running) return;
    // get current id and split into [[col], [row]]
    const curId = cell.id.split("-");
    // destructure out col and row from id
    [col, row] = [curId[0], curId[1]];
    // if dead make alive
    if (cell.classList.contains("dead")) {
      cell.setAttribute("class", "alive");
      grid[col][row] = 1;
    } else {
      // if alive make dead
      cell.setAttribute("class", "dead");
      grid[col][row] = 0;
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
        if (Math.random() + 0.1 > 1) {
          grid[col][row] = 1;
          document
            .getElementById(col + "-" + row)
            .setAttribute("class", "alive");
        }
      }
    }
  }

  function slowerBtnClick() {
    if (speed < 2000) speed = Math.floor(speed / 0.5);
    console.log(speed);
  }

  function fasterBtnClick() {
    if (speed > 10) speed = Math.floor(speed / 1.5);
    console.log(speed);
  }

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
    console.log(showGrid);
  }

  function smallerBtnClick() {
    if (size >= 20) size -= 10;
    stop();
    clearArray();
    buildArray();
    createGrid();
  }
  function biggerBtnClick() {
    if (size <= 90) size += 10;
    stop();
    clearArray();
    buildArray();
    createGrid();
  }

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
    console.log(showGrid);
    showGrid = !showGrid;
  }

  function nextGen() {
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
        }
      }
    } // nextGrid is ready to go

    // update HTML <span> with current generation
    document.querySelector("span").innerHTML = generation;
    // Final step is to take nextGrid and copy it back
    //  to grid and update the cell classes
    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {
        grid[col][row] = nextGrid[col][row];
        let cell = document.getElementById(col + "-" + row);
        if (grid[col][row] == 1) {
          cell.setAttribute("class", "alive");
        } else {
          cell.setAttribute("class", "dead");
        }
      }
    }
  }
});
