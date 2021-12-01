const fs = require("fs");

function part1(lines) {
  let count = 0;
  let prev = -1;
  for (let i = 0; i < lines.length; ++i) {
    if (i !== 0) {
      const measurement = lines[i] - prev;
      if (measurement > 0) ++count;
    }
    prev = lines[i];
  }
  return count;
}
function part2(lines) {
  let slowPtr = 0;
  let fastPtr = 0;
  let count = 0;
  let prev = -1;
  while (fastPtr < lines.length) {
    fastPtr = slowPtr + 3;
    const sumWindow = lines.slice(slowPtr, fastPtr).reduce((acc, curr) => {
      acc += +curr;
      return acc;
    }, 0);

    if (prev !== -1) {
      if (sumWindow > prev) ++count;
    }
    prev = sumWindow;
    ++slowPtr;
  }
  return count;
}
fs.readFile("input.txt", "utf8", function (err, data) {
  const lines = data.split(/\r?\n/);

  console.log("Answer1 Count:", part1(lines));
  console.log("Answer2 Count:", part2(lines));
});
