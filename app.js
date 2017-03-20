const fs = require('fs');
const getBookingSystem = require('./lib/utils').getBookingSystem;

(function app() {
  console.time('Merging data took');

  const pomiData = fs.readFileSync('./input/pomi.json');
  const gpData = fs.readFileSync('./input/gp-data.json');

  const gps = JSON.parse(gpData);
  const pomi = JSON.parse(pomiData);

  const merged = gps.map((gp) => {
    const matchedPomi = pomi.find(item => item.GPPracticeCode === gp.odsCode);
    if (matchedPomi) {
      // eslint-disable-next-line no-param-reassign
      gp.bookingSystem = getBookingSystem(gp, matchedPomi);
    }
    return gp;
  });

  fs.writeFileSync('./data/gp-data-merged.json', JSON.stringify(merged), 'utf8');

  console.timeEnd('Merging data took');
}());
