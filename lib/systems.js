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

function getRepeatPrescriptionSystem(gp, data) {
  const system = { supplier: data.Supplier };
  let url;

  switch (system.supplier) {
    case 'EMIS':
      url = 'https://patient.emisaccess.co.uk/prescriptions/request';
      break;
    case 'Informatica':
    case 'INPS':
      url = 'https://www.patient-services.co.uk/web/ps/login';
      break;
    case 'Microtest':
      url = 'https://www.thewaiting-room.net/';
      break;
    case 'TPP':
      url = `https://systmonline.tpp-uk.com/Login?PracticeId=${gp.odsCode}`;
      break;
    case 'NK':
    default:
      url = gp.contact.website;
      break;
  }
  system.url = url;
  return system;
}

function getCodedRecordsSystem(gp, data) {
  const system = { supplier: data.Supplier };
  let url;

  switch (system.supplier) {
    case 'EMIS':
      url = 'https://patient.emisaccess.co.uk/medical-record';
      break;
    case 'Informatica':
    case 'INPS':
      url = 'https://www.patient-services.co.uk/web/ps/login';
      break;
    case 'Microtest':
      url = 'https://www.thewaiting-room.net/';
      break;
    case 'TPP':
      url = `https://systmonline.tpp-uk.com/Login?PracticeId=${gp.odsCode}`;
      break;
    case 'NK':
    default:
      url = gp.contact.website;
      break;
  }
  system.url = url;
  return system;
}

module.exports = {
  getBookingSystem,
  getCodedRecordsSystem,
  getRepeatPrescriptionSystem,
};
