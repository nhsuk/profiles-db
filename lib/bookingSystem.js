function getBookingSystem(gp, data) {
  const bookingSystem = { supplier: data.Supplier };
  let bookOnlineLink;

  switch (bookingSystem.supplier) {
    case 'EMIS':
      bookOnlineLink = 'https://patient.emisaccess.co.uk/appointments/available';
      break;
    case 'Informatica':
    case 'INPS':
      bookOnlineLink = 'https://www.patient-services.co.uk/web/ps/login';
      break;
    case 'Microtest':
      bookOnlineLink = 'https://www.thewaiting-room.net/';
      break;
    case 'TPP':
      bookOnlineLink = `https://systmonline.tpp-uk.com/Login?PracticeId=${gp.odsCode}`;
      break;
    case 'NK':
    default:
      bookOnlineLink = gp.contact.website;
      break;
  }
  bookingSystem.bookOnlineLink = bookOnlineLink;
  return bookingSystem;
}

module.exports = {
  getBookingSystem,
};
