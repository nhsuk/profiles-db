const fs = require('fs');
const getBookingSystem = require('./lib/bookingSystem').getBookingSystem;

(function app() {
  const bookingSystemTimerMsg = 'Merging Booking System data took';
  console.time(bookingSystemTimerMsg);

  const bookingSystemData = fs.readFileSync('./input/booking.json');
  const gpData = fs.readFileSync('./input/gp-data.json');

  const gps = JSON.parse(gpData);
  const bookingSystems = JSON.parse(bookingSystemData);

  const merged = gps.map((gp) => {
    const matchedBookingSystem = bookingSystems.find(item => item.GPPracticeCode === gp.odsCode);
    if (matchedBookingSystem) {
      // eslint-disable-next-line no-param-reassign
      gp.bookingSystem = getBookingSystem(gp, matchedBookingSystem);
    }
    return gp;
  });

  fs.writeFileSync('./data/gp-data-merged.json', JSON.stringify(merged), 'utf8');

  console.timeEnd(bookingSystemTimerMsg);
}());
