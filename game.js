document.addEventListener("DOMContentLoaded", () => {
  // Global Variables
  let rows = 30;
  let cols = 30;
  // State Variables
  let running = false;
  let generation = 0;
  let update; // setTimeout(cb, speed)
  let speed = 500; // ms per generation

  // Button Event Listeners
  const startBtn = document.getElementById("start-stop");
  startBtn.addEventListener("click", startBtnClick);
  const stepBtn = document.getElementById("step");
  stepBtn.addEventListener("click", stepBtnClick);
  const randomBtn = document.getElementById("random");
  randomBtn.addEventListener("click", randomBtnClick);
  // TODO add clear btn

  // Create 2d Array to store grid [[col,row],[...]..]
  let grid = new Array(cols);
  for (let i = 0; i < cols; i++) {
    grid[i] = new Array(rows);
  }
  // set all values in grid array to 0
  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows; row++) {
      grid[col][row] = 0;
    }
  }
  // Initialize Empty Grid with divs with class 'dead' and click event handler
  // that switchs values from 0 <--> 1 and class from 'dead' <--> 'alive'
  createGrid();

  function createGrid() {
    const gridContainer = document.querySelector(".grid-container");
    // loop through each column and row
    for (let col = 0; col < cols; col++) {
      // create new cell div for each column
      let divRow = document.createElement("div");
      divRow.classList.add("div-row");
      for (let row = 0; row < rows; row++) {
        // create id for cell with col-row acting liky [x][y] coordinates in the grid
        const cell = document.createElement("div");
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
        if (Math.random() + 0.3 >= 1) {
          grid[col][row] = 1;
          document
            .getElementById(col + "-" + row)
            .setAttribute("class", "alive");
        }
      }
    }
  }

  function nextGen() {
    // make exact copy of current grid
    const nextGrid = grid.map((arr) => [...arr]);
    // loop over every cell in grid
    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {
        // count number of neighbors for each cell
        let neighbors = 0;
        // loop through a 9x9 grid around each cell
        for (let x = -1; x < 2; x++) {
          for (let y = -1; y < 2; y++) {
            // set variables for current x,y positions on 9x9 grid
            const curCell = grid[col][row];
            const curX = col + x;
            const curY = row + y;
            if (x == 0 && y == 0) continue;
            // exclude all edges
            if (curX >= 0 && curX < cols && curY >= 0 && curY < rows) {
              // count current neighbors if not an edge
              if (grid[curX][curY]) neighbors++;
            }
            // end count

            // apply game rules to each cell to nextGrid (empty 2d array of all 0's)
            // if cell is alive and neighbors < 2 or > 3 the cell dies
            if ((curCell == 1 && neighbors < 2) || neighbors > 3)
              nextGrid[col][row] = 0;
            // if cell is alive and neighbors == 2 or == 3 the cell stays alive
            if ((curCell == 1 && neighbors == 2) || neighbors == 3)
              nextGrid[col][row] = 1;
            // if cell is dead and neighbors == 3 --> cell becomes alive next gen
            else if (curCell == 0 && neighbors == 3) nextGrid[col][row] = 1;
            // otherwise cell stays dead - do nothing
          }
        }
      }
    }
    // update generation number HTML on page
    document.querySelector("span").innerHTML = generation;
    // copy nextGrid to grid, and reset nextGrid to all 0 values
    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {
        grid[col][row] = nextGrid[col][row];
        nextGrid[col][row] = 0;
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
