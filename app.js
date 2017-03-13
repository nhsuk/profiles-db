const fs = require('fs');

console.time('Merging data took');

const pomiData = fs.readFileSync('./input/pomi.json')
const gpData = fs.readFileSync('./input/gp-data.json');

const gps = JSON.parse(gpData);
const pomi = JSON.parse(pomiData);

const merged = gps.map((gp) => {
  const matchedPomi = pomi.find((item) => {
    return item.GPPracticeCode === gp.odsCode;
  });
  gp.supplier = matchedPomi ? matchedPomi.Supplier : undefined;
  return gp;
});

fs.writeFileSync('./data/gp-data-merged.json', JSON.stringify(merged), 'utf8');

console.timeEnd('Merging data took');
