const tsv = require("tsv");
const fs = require("fs");
const path = require("path");

console.log("Reading out/json/ukrainian-meta.json file...");
const meta = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, "..", "out", "json", "ukrainian-meta.json"),
    "utf8",
  ),
);
console.log("Done.");

console.log("Re-aggregating strings...");
const clearArray = [];
meta.forEach((item) => {
  if (item.translation !== null) {
    item.ids.forEach((id) => {
      clearArray[id] = {
        id: '""',
        description: '""',
        en: `"${item.value}"`,
        local: `"${item.translation}"`,
      };
    });
  }
});
console.log("Done.");

console.log("Writing to out/Ukrainian.tsv...");
const result = tsv.stringify(clearArray);
fs.writeFileSync(path.resolve(__dirname, "..", "out", "Ukrainian.tsv"), result);
console.log("Done.");
