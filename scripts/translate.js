const fs = require("fs");
require("dotenv").config();

function writeToFile(object) {
  fs.writeFileSync(
    "./out/json/ukrainian-meta.json",
    JSON.stringify(object, null, 2),
  );
}

async function completeTranslate(agregatedStrings) {
  const authHeaders = {
    "Ocp-Apim-Subscription-Key": process.env.KEY,
    "Ocp-Apim-Subscription-Region": process.env.LOCATION,
    "Content-type": "application/json",
  };
  // eslint-disable-next-line import/no-extraneous-dependencies
  const { default: fetch } = await import("node-fetch");

  async function fetcher(url, options, retry = 0) {
    try {
      // noinspection UnnecessaryLocalVariableJS
      const a = await fetch(url, options);
      return a;
    } catch (e) {
      if (retry < 3) {
        console.warn(`Error fetching ${url}, retrying... ${retry + 1}`);
        return fetcher(url, options, retry + 1);
      }
      throw e;
    }
  }

  async function translate(input, to = "uk") {
    const url = new URL(`translate?api-version=3.0`, process.env.ENDPOINT);
    url.searchParams.append("to", to);
    url.searchParams.append("from", "en");
    const response = await fetcher(url, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify([{ text: input }]),
    });
    const responseJson = await response.json();
    return responseJson[0].translations[0].text;
  }

  console.log("Preparing to translate...");

  const aggregatedStringsWithIndex = agregatedStrings.map((item, index) => ({
    ...item,
    index,
  }));
  const stringsToTranslate = aggregatedStringsWithIndex.filter(
    (item) => item.translation === null,
  );
  const chunkedStrings = [];
  for (let i = 0; i < stringsToTranslate.length; i += 10) {
    chunkedStrings.push(stringsToTranslate.slice(i, i + 10));
  }
  async function translateRow(row) {
    if (!row.value) {
      console.log("Got empty string, skipping...", row);
      throw new Error("Got empty string");
    } else {
      const translation = await translate(row.value);
      console.log(`Translated "${row.value}" to "${translation}"`);
      return {
        index: row.index,
        translation,
      };
    }
  }

  console.log("Translating...");

  for (let i = 0; i < chunkedStrings.length; i++) {
    console.log(`Translating chunk ${i + 1} of ${chunkedStrings.length}`);
    const chunk = chunkedStrings[i];

    const results = await Promise.allSettled(chunk.map(translateRow));

    console.log("Writing to file...");
    aggregatedStringsWithIndex.forEach((item, index) => {
      const newData = results
        .filter((translatedStatus) => translatedStatus.status === "fulfilled")
        .map((translatedStatus) => translatedStatus.value)
        .find((result) => result.index === index);
      if (!newData) {
        return;
      }
      // eslint-disable-next-line no-param-reassign
      item.translation = newData.translation;
    });
    writeToFile(aggregatedStringsWithIndex);

    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
  }

  console.log("Translation complete!");
}

if (!fs.existsSync("./out/json/ukrainian-meta.json")) {
  console.log("Reading ukrainian-index.json file...");
  const indexFile = JSON.parse(
    fs.readFileSync("./out/json/ukrainian-index.json", "utf8"),
  );
  console.log("Done!");

  const aggregatedStrings = [];

  console.log("Aggregating strings...");
  indexFile.forEach((item) => {
    const index = aggregatedStrings.findIndex(
      (aggregatedItem) => aggregatedItem.value === item.en,
    );
    if (index === -1) {
      aggregatedStrings.push({
        value: item.en,
        ids: [item.id],
        translation: item.local === item.en ? null : item.local,
      });
    } else {
      aggregatedStrings[index].ids.push(item.id);
      if (
        aggregatedStrings[index].translation === null &&
        item.local !== item.en
      ) {
        aggregatedStrings[index].translation = item.local;
      }
    }
  });
  console.log("Done!");
  completeTranslate(aggregatedStrings);
} else {
  console.log("ukrainian-meta.json already exists! Reading file...");
  const metaFile = JSON.parse(
    fs.readFileSync("./out/json/ukrainian-meta.json", "utf8"),
  );
  console.log("Done!");
  console.log("Completing translation...");
  completeTranslate(metaFile);
}
