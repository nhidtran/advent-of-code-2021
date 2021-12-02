const fs = require("fs");

let pos = { x: 0, y: 0 };
let aim = 0;
function move({ direction, count, initialPos, aim }) {
  let newPos = initialPos;
  let newAim = aim;
  switch (direction) {
    case "forward": {
      newPos = {
        x: initialPos.x + count,
        y: initialPos.y + count * aim,
      };
      break;
    }
    case "down": {
      newPos = {
        x: initialPos.x,
        y: initialPos.y,
      };
      newAim += count;
      break;
    }
    case "up": {
      newPos = {
        x: initialPos.x,
        y: initialPos.y,
      };
      newAim -= count;
      break;
    }
  }
  return {
    newPos,
    newAim,
  };
}
function calculatePos({ x, y }) {
  return Math.abs(x * y);
}

fs.readFile("input.txt", "utf8", function (err, data) {
  const directions = data.split(/\r?\n/);
  directions.map((x) => {
    const [direction, count] = x.split(" ");
    const { newPos, newAim } = move({
      direction,
      count: +count,
      initialPos: pos,
      aim,
    });
    pos = newPos;
    aim = newAim;
  });
  console.log(calculatePos(pos));
});
