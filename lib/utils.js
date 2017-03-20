function getBookingSystem(gp, pomiData) {
  const bookingSystem = { supplier: pomiData.Supplier };
  let bookOnlineLink;

  switch (bookingSystem.supplier) {
    case 'EMIS':
      bookOnlineLink = 'https://patient.emisaccess.co.uk/Account/Login';
      break;
    case 'Informatica':
    case 'INPS':
      bookOnlineLink = 'https://www.myvisiononline.co.uk/vpp/';
      break;
    case 'Microtest':
      bookOnlineLink = 'https://www.thewaiting-room.net/';
      break;
    case 'TPP':
      bookOnlineLink = `https://systmonline.tpp-uk.com/Login?PracticeId=${gp.odsCode}`;
      break;
    case 'NK':
    case 'EMIS (I)':
    case 'INPS (I)':
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
