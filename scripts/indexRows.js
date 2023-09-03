const tsv = require("tsv");
const fs = require("fs");
const path = require("path");

// read "../Ukrainian.tsv" file
const data = tsv.parse(
  fs.readFileSync(path.resolve(__dirname, "..", "Ukrainian.tsv"), "utf8"),
);
console.log(`Data loaded. Got ${data.length} rows.`);
// Add id to each row
console.log("Adding id to each row...");
const dataWithId = data.map((row, index) => ({ ...row, id: index }));
console.log("Done.");
// Write to out/json/ukrainian-index.json
console.log("Creating out/json/ directory...");
fs.mkdirSync("out/json/", { recursive: true });
console.log("Writing to out/json/ukrainian-index.json...");
fs.writeFileSync(
  "out/json/ukrainian-index.json",
  JSON.stringify(dataWithId, null, 4),
);
console.log("Done.");
