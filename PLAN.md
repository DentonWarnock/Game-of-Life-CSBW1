# "Game of Life" - PLAN

Main 4 Rules of the Game

- Any live cell with fewer than two live neighbours dies, as if by underpopulation.
- Any live cell with two or three live neighbours lives on to the next generation.
- Any live cell with more than three live neighbours dies, as if by overpopulation.
- Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

Step 1 - create 20x20 grid

        create 2 dimensional array to store grid points in

Step 2 - populate grid with random amounts of live/dead cells

        use Math.random to fill the grid array with slightly less than half alive cells

Step 3 - display populated grid on screen

Step 4 - apply rules of game to cells - update the grid changes all at once(NOT one at a time)

    create copy of the current grid array to apply rule changes to
    count number of neighbor cells in the 9x9 grid around each current cell(excluding self)
        check if cell is near an edge and exclude checking edges or else we could error undefined
        if cell is alive and neighbors < 2 || > 3 neighbors --> cell will die
        if cell is dead and neighbors == 3 --> cell will become alive
        else do not change current state of cell

        once all cells have been updated - update the grid state with the grid copy

Step 5 - Add buttons to start/stop game
