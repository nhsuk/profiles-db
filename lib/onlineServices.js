const systems = require('./systems');

function findByOdsCode(data, odsCode) {
  return data.find(item => item.GPPracticeCode === odsCode);
}

function getBookingSystem(gp, match) {
  return systems.getBookingSystem(gp, match);
}

function getCodedRecordsSystem(gp, match) {
  return systems.getCodedRecordsSystem(gp, match);
}

function getRepeatPrescriptionSystem(gp, match) {
  return systems.getRepeatPrescriptionSystem(gp, match);
}

function getSupplierSystem(config, match) {
  const gp = config.gp;
  let system;

  switch (config.key) {
    case 'appointments':
      system = getBookingSystem(gp, match);
      break;
    case 'repeatPrescriptions':
      system = getRepeatPrescriptionSystem(gp, match);
      break;
    case 'codedRecords':
      system = getCodedRecordsSystem(gp, match);
      break;
    default:
      throw new Error(`Unknown key: ${config.key}`);
  }
  return system;
}

function add(config) {
  const gp = config.gp;
  const match = findByOdsCode(config.systemList, gp.odsCode);

  if (match) {
    const system = getSupplierSystem(config, match);
    // eslint-disable-next-line no-param-reassign
    gp.onlineServices[config.key] = system;
  }
}

module.exports = {
  add,
};
