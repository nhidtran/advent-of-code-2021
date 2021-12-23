const fs = require("fs");
const { parse } = require("path");

function BingoBoard(board, id) {
  this.coordinates = {};
  this.winner = [];
  (this.id = id), this.createBoardCoordinates(board);
  return this;
}
BingoBoard.prototype = {
  createBoardCoordinates: function (grid) {
    const coordinates = grid.reduce((acc, row, y) => {
      row.forEach((val, x) => {
        // x is on the horizontal axis
        const key = parseInt(val);
        acc.set(key, {
          x,
          y,
          val: key,
          down: y + 1 < grid.length ? parseInt(grid[y + 1][x]) : null,
          up: y - 1 >= 0 ? parseInt(grid[y - 1][x]) : null,
          left: x - 1 >= 0 ? parseInt(grid[y][x - 1]) : null,
          right: x + 1 < row.length ? parseInt(grid[y][x + 1]) : null,
          visited: false,
        });
      });
      return acc;
    }, new Map());
    this.coordinates = coordinates;
    return this;
  },
  markPiece: function (val) {
    this.coordinates.set(val, {
      ...this.coordinates.get(val),
      visited: true,
    });
    return this;
  },
  traverse: function (dir, node, frontier) {
    const nextNode =
      node && node[dir] && this.coordinates
        ? this.coordinates.get(node[dir])
        : null;

    if (!node || !nextNode || !nextNode.visited) return frontier;
    frontier.push(nextNode);
    this.traverse(dir, nextNode, frontier, this.coordinates);
    return frontier;
  },
  checkNeighbors: function (node) {
    // check left and right to see if there adjacent nodes have been called out
    const leftVisited = this.traverse("left", node, []);
    const rightVisited = this.traverse("right", node, []);

    if ([...leftVisited, ...rightVisited].length == 4) {
      return [...leftVisited, ...rightVisited];
    }

    const topVisited = this.traverse("top", node, []);
    const bottomVisited = this.traverse("down", node, []);
    if ([...topVisited, ...bottomVisited].length == 4) {
      return [...bottomVisited, ...topVisited];
    }
    return [];
  },
  checkWinner: function (calledNumber) {
    let frontier = [];
    const node = this.coordinates.get(calledNumber);
    if (!!node) {
      // check if neighbors also have been called out
      frontier = [node, ...this.checkNeighbors(node)];
      if (frontier.length == 5) {
        this.winner = [...frontier];
      }
    }
    return this;
  },
};

function Game(boards, numbers) {
  this.boards = boards || [];
  this.nums = numbers;
}

Game.prototype = {
  play: function () {
    let i = 0;
    let j = 0;
    while (i < this.nums.length) {
      j = 0;
      while (j < this.boards.length) {
        // check each board for winners
        const node = this.boards[j].coordinates.get(this.nums[i]);
        if (node && node.val) {
          this.boards[j].coordinates.set(this.nums[i], {
            ...node,
            visited: true,
          });
          const validatedBoard = this.boards[j].checkWinner(this.nums[i]);
          if (validatedBoard.winner.length) {
            return validatedBoard;
          }
        }

        ++j;
      }
      ++i;
    }
  },
};

fs.readFile("input.txt", "utf8", function (err, data) {
  const lines = data.split(/\r?\n/);
  const nums = lines[0].split(",").map((char) => parseInt(char));
  // const nums = [14, 21, 17, 24, 4];

  const newarr = lines.slice(2);
  const { boards, count } = newarr.reduce(
    (acc, curr, idx) => {
      let line = curr.trim().split(/\s+/);
      if (line[0] == "") {
        ++acc.count;
        return acc;
      }
      line = line.map((char) => parseInt(char));
      if (!acc.boards[acc.count]) {
        acc.boards.push([line]);
      } else {
        acc.boards[acc.count].push(line);
      }
      return acc;
    },
    { boards: [], count: 0 }
  );
  const bingoBoards = boards.reduce((boardAcc, grid, idx) => {
    const b = new BingoBoard(grid, idx);
    boardAcc.push(b);
    return boardAcc;
  }, []);

  const BingoGame = new Game(bingoBoards, nums);
  const winningBoard = BingoGame.play();
  let nonWinners = [];
  for (let [k, v] of winningBoard.coordinates) {
    if (!v.visited) {
      nonWinners.push(k);
    }
  }
  const sum = nonWinners.reduce((acc, num) => {
    acc += num;
    return acc;
  });
  console.log("%csum", "color:pink", sum * 24);
});
