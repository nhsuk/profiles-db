const fs = require('fs');
const onlineServices = require('./lib/onlineServices');

const gps = require('./input/gp-data.json');
const bookingSystems = require('./input/booking.json');
const scriptSystems = require('./input/scripts.json');
const recordsSystems = require('./input/records.json');

(function app() {
  const timerMsg = 'Merging POMI data took';
  console.time(timerMsg);

  const merged = gps.map((gp) => {
    /* eslint-disable no-param-reassign */
    gp.onlineServices = {};
    onlineServices.add({ systemList: bookingSystems, gp, key: 'appointments' });
    onlineServices.add({ systemList: scriptSystems, gp, key: 'repeatPrescriptions' });
    onlineServices.add({ systemList: recordsSystems, gp, key: 'codedRecords' });
    /* eslint-enable no-param-reassign */

    return gp;
  });

  fs.writeFileSync('./data/gp-data-merged.json', JSON.stringify(merged), 'utf8');

  console.timeEnd(timerMsg);
}());
