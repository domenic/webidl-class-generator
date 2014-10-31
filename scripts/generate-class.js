// Usage: `node scripts/generate-class.js < test/cases/html-hr-element.idl`

require("traceur").require.makeDefault(function (filename) {
  return filename.indexOf("node_modules") === -1;
});

const generate = require("..").default;

let input = "";
process.stdin.on("data", function (data) {
    input += data;
});
process.stdin.on("end", function () {
    process.stdout.write(generate(input));
});
