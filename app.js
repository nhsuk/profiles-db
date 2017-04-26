const fs = require('fs');
const prettyHrtime = require('pretty-hrtime');
const log = require('./lib/logger');
const onlineServices = require('./lib/onlineServices');
const constants = require('./lib/constants');

const gps = require('./input/gp-data.json');
const bookingSystems = require('./input/booking.json');
const scriptSystems = require('./input/scripts.json');
const recordsSystems = require('./input/records.json');

function saveFile(mergedData) {
  const outputDir = constants.OUTPUT_DIR;
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }
  fs.writeFileSync(`${outputDir}/gp-data-merged.json`, JSON.stringify(mergedData), 'utf8');
}

(function app() {
  const startTime = process.hrtime();

  const merged = gps.map((gp) => {
    /* eslint-disable no-param-reassign */
    gp.onlineServices = {};
    onlineServices.add({ systemList: bookingSystems, gp, key: 'appointments' });
    onlineServices.add({ systemList: scriptSystems, gp, key: 'repeatPrescriptions' });
    onlineServices.add({ systemList: recordsSystems, gp, key: 'codedRecords' });
    /* eslint-enable no-param-reassign */

    return gp;
  });

  saveFile(merged);
  const endTime = process.hrtime(startTime);
  log.info(`Merging GP data sets took: ${prettyHrtime(endTime)}`);
}());
