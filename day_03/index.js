const fs = require("fs");
function convertBinaryToDecimal(arr) {
  let decimal = 0;
  let j = 0;
  for (let i = arr.length - 1; i >= 0; --i) {
    decimal += arr[i] * Math.pow(2, j++);
  }
  return decimal;
}
function calculate(lines) {
  return lines.reduce((acc, line, idx) => {
    const arr = Array.from(line);
    arr.forEach((bit, idx) => {
      if (!acc[idx]) {
        acc[idx] = {
          mostCommon: -1,
          0: 0,
          1: 0,
        };
      }
      acc[idx][bit] = acc[idx][bit] + 1;
      acc[idx].mostCommon = acc[idx][0] > acc[idx][1] ? 0 : 1;
      acc[idx].leastCommon = acc[idx][0] < acc[idx][1] ? 0 : 1;
      if (acc[idx][0] == acc[idx][1]) {
        acc[idx].mostCommon = 1;
        acc[idx].leastCommon = 0;
      }
    });
    return acc;
  }, []);
}
fs.readFile("input.txt", "utf8", function (err, data) {
  const lines = data.split(/\r?\n/);
  const res = calculate(lines);
  const { gamma, epsilon } = res.reduce(
    (acc, curr, idx) => {
      acc.gamma.push(curr.mostCommon);
      acc.epsilon.push(curr.leastCommon);
      return acc;
    },
    { gamma: [], epsilon: [] }
  );

  let gammaDecimal = convertBinaryToDecimal(gamma);
  let epsilonDecimal = convertBinaryToDecimal(epsilon);
  console.log("Answer 1:", gammaDecimal * epsilonDecimal, gamma);

  let i = 0;
  let oxygenBinary = [];
  let co2Binary = [];
  temp = Object.keys(res);
  while (i < Object.keys(res).length) {
    if (i == 0) {
      oxygenBinary = Array.from(lines).filter(
        (line) => +line[0] == +res[0].mostCommon
      );
      co2Binary = Array.from(lines).filter(
        (line) => +line[0] == +res[0].leastCommon
      );
    } else {
      temp = calculate(oxygenBinary);

      if (oxygenBinary.length > 1) {
        oxygenBinary = oxygenBinary.filter(
          (line) => +line[i] == +temp[i].mostCommon
        );
      }
      if (co2Binary.length > 1) {
        co2Binary = co2Binary.filter(
          (line) => +line[i] == +temp[i].leastCommon
        );
      }
    }
    ++i;
  }
  const oxygen = convertBinaryToDecimal(Array.from(oxygenBinary[0]));
  const co2 = convertBinaryToDecimal(Array.from(co2Binary[0]));
  console.log("Anser2:", oxygen, co2, oxygen * co2);
});
