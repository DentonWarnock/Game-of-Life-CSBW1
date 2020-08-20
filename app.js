document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.querySelector("canvas");
  // context of canvas
  const ctx = canvas.getContext("2d");

  const resolution = 40;
  canvas.width = 400;
  canvas.height = 400;
  const cols = canvas.width / resolution;
  const rows = canvas.height / resolution;

  // create empty grid
  function createGrid() {
    // create array filled with col number of arrays
    // fill each array with row number of 0's
    return new Array(cols).fill(null).map(() => new Array(rows).fill(0));
  }

  const emptyGrid = createGrid();
  // generate random grid
  const randomGrid = emptyGrid.map(() =>
    new Array(rows).fill(null).map(() => Math.floor(Math.random() * 1.25))
  );
  console.log(randomGrid);

  displayGrid(randomGrid);

  function displayGrid(grid) {
    // loop through every cell in grid
    for (let col = 0; col < grid.length; col++) {
      for (let row = 0; row < grid[col].length; row++) {
        const cell = grid[col][row];
        // draw rectangles on grid with canvas commands
        ctx.beginPath();
        // rect(x, y, width, height)
        ctx.rect(col * resolution, row * resolution, resolution, resolution);
        // if cell is alive fill back, else white
        ctx.fillStyle = cell ? "black" : "white";
        ctx.fill();
        // draw commands
        ctx.stroke();
      }
    }
  }
  //   // create game board
  //   function createBoard() {
  //     // get shuffled game array with random bombs
  //     const bombsArray = Array(bombAmount).fill("bomb");
  //     const emptyArray = Array(width * width - bombAmount).fill("valid");
  //     // join the above 2 arrays together
  //     const gameArray = emptyArray.concat(bombsArray);
  //     // generate random game board
  //     const shuffledArray = gameArray.sort(() => Math.random() - 0.5);

  //     for (let i = 0; i < width * width; i++) {
  //       const square = document.createElement("div");
  //       square.setAttribute("id", i);
  //       square.classList.add(shuffledArray[i]);
  //       grid.appendChild(square);
  //       squares.push(square);

  //       // normal click
  //       square.addEventListener("click", (e) => click(square));

  //       // cntrl and left click
  //       square.oncontextmenu = (e) => {
  //         e.preventDefault();
  //         addFlag(square);
  //       };
  //     }

  //     // add numbers to board
  //     for (let i = 0; i < squares.length; i++) {
  //       let total = 0;
  //       const isLeftEdge = i % width === 0;
  //       const isRightEdge = i % width === -1;

  //       if (squares[i].classList.contains("valid")) {
  //         if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains("bomb"))
  //           total++;
  //         if (
  //           i > 9 &&
  //           !isRightEdge &&
  //           squares[i + 1 - width].classList.contains("bomb")
  //         )
  //           total++;
  //         if (i > 10 && squares[i - width].classList.contains("bomb")) total++;
  //         if (
  //           i > 11 &&
  //           !isLeftEdge &&
  //           squares[i - 1 - width].classList.contains("bomb")
  //         )
  //           total++;
  //         if (i < 98 && !isRightEdge && squares[i + 1].classList.contains("bomb"))
  //           total++;
  //         if (
  //           i < 90 &&
  //           !isLeftEdge &&
  //           squares[i - 1 + width].classList.contains("bomb")
  //         )
  //           total++;
  //         if (
  //           i < 88 &&
  //           !isRightEdge &&
  //           squares[i + 1 + width].classList.contains("bomb")
  //         )
  //           total++;
  //         if (i < 89 && squares[i + width].classList.contains("bomb")) total++;
  //         squares[i].setAttribute("data", total);
  //       }
  //     }
  //   }

  //   createBoard();

  //   // add Flag with right click
  //   function addFlag(square) {
  //     if (isGameOver) return;
  //     if (!square.classList.contains("checked") && flags < bombAmount) {
  //       if (!square.classList.contains("flag")) {
  //         square.classList.add("flag");
  //         square.innerHTML = "";
  //         flags++;
  //         console.log(flags);
  //         checkForWin();
  //       } else {
  //         square.classList.remove("flag");
  //         square.innerHTML = "";
  //         flags--;
  //       }
  //     }
  //   }

  //   // click on square actions
  //   function click(square) {
  //     let currentId = square.id;
  //     if (isGameOver) return;
  //     if (
  //       square.classList.contains("checked") ||
  //       square.classList.contains("flag")
  //     )
  //       return;
  //     if (square.classList.contains("bomb")) {
  //       gameOver(square);
  //     } else {
  //       let total = square.getAttribute("data");
  //       if (total != 0) {
  //         square.classList.add("checked");
  //         square.innerHTML = total;
  //         return;
  //       }
  //     }
  //     checkSquare(square, currentId);
  //     square.classList.add("checked");
  //   }

  //   // check neighboring square once square is clicked
  //   function checkSquare(square, currentId) {
  //     const isLeftEdge = currentId % width === 0;
  //     const isRightEdge = currentId % width === -1;

  //     setTimeout(() => {
  //       if (currentId > 0 && !isLeftEdge) {
  //         const newId = squares[parseInt(currentId) - 1].id;
  //         const newSquare = document.getElementById(newId);
  //         click(newSquare);
  //       }
  //       if (currentId > 9 && !isRightEdge) {
  //         const newId = squares[parseInt(currentId) + 1 - width].id;
  //         const newSquare = document.getElementById(newId);
  //         click(newSquare);
  //       }
  //       if (currentId > 10) {
  //         const newId = squares[parseInt(currentId) - width].id;
  //         const newSquare = document.getElementById(newId);
  //         click(newSquare);
  //       }
  //       if (currentId > 11 && !isLeftEdge) {
  //         const newId = squares[parseInt(currentId) - 1 - width].id;
  //         const newSquare = document.getElementById(newId);
  //         click(newSquare);
  //       }
  //       if (currentId < 98 && !isRightEdge) {
  //         const newId = squares[parseInt(currentId) + 1].id;
  //         const newSquare = document.getElementById(newId);
  //         click(newSquare);
  //       }
  //       if (currentId < 90 && !isLeftEdge) {
  //         const newId = squares[parseInt(currentId) - 1 + width].id;
  //         const newSquare = document.getElementById(newId);
  //         click(newSquare);
  //       }
  //       if (currentId < 88 && !isRightEdge) {
  //         const newId = squares[parseInt(currentId) + 1 + width].id;
  //         const newSquare = document.getElementById(newId);
  //         click(newSquare);
  //       }
  //       if (currentId < 89) {
  //         const newId = squares[parseInt(currentId) + width].id;
  //         const newSquare = document.getElementById(newId);
  //         click(newSquare);
  //       }
  //     }, 10);
  //   }

  //   // game over
  //   function gameOver(square) {
  //     console.log("BOOM! Game Over!");
  //     isGameOver = true;

  //     // show ALL the bombs
  //     squares.forEach((square) => {
  //       if (square.classList.contains("bomb")) {
  //         square.innerHTML = "B";
  //       }
  //     });
  //   }

  //   // check for win
  //   function checkForWin() {
  //     console.log("CHECKING FOR WIN");
  //     let matches = 0;
  //     for (let i = 0; i < squares.length; i++) {
  //       if (
  //         squares[i].classList.contains("flag") &&
  //         squares[i].classList.contains("bomb")
  //       ) {
  //         matches++;
  //         console.log(matches);
  //       }
  //       if (matches === bombAmount) {
  //         console.log("YOU WON!");
  //         isGameOver = true;
  //       }
  //     }
  //   }
});
