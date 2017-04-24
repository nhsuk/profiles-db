const fs = require('fs');
const onlineServices = require('./lib/onlineServices');

function findByOdsCode(data, odsCode) {
  return data.find(item => item.GPPracticeCode === odsCode);
}

(function app() {
  const timerMsg = 'Merging POMI data took';
  console.time(timerMsg);

  const bookingSystemData = fs.readFileSync('./input/booking.json');
  const recordsSystemsData = fs.readFileSync('./input/records.json');
  const scriptData = fs.readFileSync('./input/scripts.json');
  const gpData = fs.readFileSync('./input/gp-data.json');

  const gps = JSON.parse(gpData);
  const bookingSystems = JSON.parse(bookingSystemData);
  const scriptSystems = JSON.parse(scriptData);
  const recordsSystems = JSON.parse(recordsSystemsData);

  const merged = gps.map((gp) => {
    // eslint-disable-next-line no-param-reassign
    gp.onlineServices = {};

    const matchedBookingSystem = findByOdsCode(bookingSystems, gp.odsCode);
    if (matchedBookingSystem) {
      // eslint-disable-next-line no-param-reassign
      gp.bookingSystem = onlineServices.getBookingSystem(gp, matchedBookingSystem);
    }

    const matchedScriptSystem = findByOdsCode(scriptSystems, gp.odsCode);
    if (matchedScriptSystem) {
      // eslint-disable-next-line no-param-reassign
      gp.onlineServices.repeatPrescriptions =
        onlineServices.getRepeatPrescriptionSystem(gp, matchedScriptSystem);
    }

    const matchedRecordsSystem = findByOdsCode(recordsSystems, gp.odsCode);
    if (matchedRecordsSystem) {
      // eslint-disable-next-line no-param-reassign
      gp.onlineServices.codedRecords =
        onlineServices.getCodedRecordsSystem(gp, matchedRecordsSystem);
    }
    return gp;
  });

  fs.writeFileSync('./data/gp-data-merged.json', JSON.stringify(merged), 'utf8');

  console.timeEnd(timerMsg);
}());
