const chai = require('chai');
const utils = require('../lib/bookingSystem');

const expect = chai.expect;

describe('utils', () => {
  describe('getBookingSystem', () => {
    const odsCode = 'A12345';
    const gpWebsite = 'http://gp.website.com';

    function getBaseBookingSystemData(supplier) {
      return {
        PeriodEnd: '31/12/2016',
        GPPracticeCode: odsCode,
        Supplier: supplier,
      };
    }

    function getBaseGpData() {
      return { odsCode, contact: {} };
    }

    describe('edge cases', () => {
      it('should return the GPs website when there is no supplier', () => {
        const gpData = getBaseGpData();
        gpData.contact = { website: gpWebsite };
        const bookingSystemData = getBaseBookingSystemData();

        const bookingSystem = utils.getBookingSystem(gpData, bookingSystemData);

        // eslint-disable-next-line no-unused-expressions
        expect(bookingSystem).to.not.be.undefined;
        expect(bookingSystem.bookOnlineLink).to.be.equal(gpWebsite);
      });
    });

    describe('for known systems', () => {
      it('should return the suppliers system address for EMIS', () => {
        const gpData = getBaseGpData();
        const bookingSystemData = getBaseBookingSystemData('EMIS');

        const bookingSystem = utils.getBookingSystem(gpData, bookingSystemData);

        // eslint-disable-next-line no-unused-expressions
        expect(bookingSystem).to.not.be.undefined;
        expect(bookingSystem.bookOnlineLink)
          .to.be.equal('https://patient.emisaccess.co.uk/appointments/available');
      });

      it('should return the suppliers system address for INPS', () => {
        const gpData = getBaseGpData();
        const bookingSystemData = getBaseBookingSystemData('INPS');

        const bookingSystem = utils.getBookingSystem(gpData, bookingSystemData);

        // eslint-disable-next-line no-unused-expressions
        expect(bookingSystem).to.not.be.undefined;
        expect(bookingSystem.bookOnlineLink)
          .to.be.equal('https://www.patient-services.co.uk/web/ps/login');
      });

      it('should return the suppliers system address for Informatica', () => {
        const gpData = getBaseGpData();
        const bookingSystemData = getBaseBookingSystemData('Informatica');

        const bookingSystem = utils.getBookingSystem(gpData, bookingSystemData);

        // eslint-disable-next-line no-unused-expressions
        expect(bookingSystem).to.not.be.undefined;
        expect(bookingSystem.bookOnlineLink)
          .to.be.equal('https://www.patient-services.co.uk/web/ps/login');
      });

      it('should return the suppliers system address for Microtest', () => {
        const gpData = getBaseGpData();
        const bookingSystemData = getBaseBookingSystemData('Microtest');

        const bookingSystem = utils.getBookingSystem(gpData, bookingSystemData);

        // eslint-disable-next-line no-unused-expressions
        expect(bookingSystem).to.not.be.undefined;
        expect(bookingSystem.bookOnlineLink)
          .to.be.equal('https://www.thewaiting-room.net/');
      });

      it('should return the GPs website address for NK', () => {
        const gpData = getBaseGpData();
        gpData.contact = { website: gpWebsite };
        const bookingSystemData = getBaseBookingSystemData('NK');

        const bookingSystem = utils.getBookingSystem(gpData, bookingSystemData);

        // eslint-disable-next-line no-unused-expressions
        expect(bookingSystem).to.not.be.undefined;
        expect(bookingSystem.bookOnlineLink).to.be.equal(gpWebsite);
      });

      it('should return undefined when no GP website is available for NK', () => {
        const gpData = getBaseGpData();
        const bookingSystemData = getBaseBookingSystemData('NK');

        const bookingSystem = utils.getBookingSystem(gpData, bookingSystemData);

        // eslint-disable-next-line no-unused-expressions
        expect(bookingSystem).to.not.be.undefined;
        // eslint-disable-next-line no-unused-expressions
        expect(bookingSystem.bookOnlineLink).to.be.undefined;
      });

      it('should return the suppliers system address for TPP', () => {
        const gpData = getBaseGpData();
        const bookingSystemData = getBaseBookingSystemData('TPP');

        const bookingSystem = utils.getBookingSystem(gpData, bookingSystemData);

        // eslint-disable-next-line no-unused-expressions
        expect(bookingSystem).to.not.be.undefined;
        expect(bookingSystem.bookOnlineLink)
          .to.be
          .equal(`https://systmonline.tpp-uk.com/Login?PracticeId=${odsCode}`);
      });
    });

    describe('for unknown systems', () => {
      it('should return undefined when no GP website is available', () => {
        const gpData = getBaseGpData();
        const bookingSystemData = getBaseBookingSystemData('EMIS (I)');

        const bookingSystem = utils.getBookingSystem(gpData, bookingSystemData);

        // eslint-disable-next-line no-unused-expressions
        expect(bookingSystem).to.not.be.undefined;
        // eslint-disable-next-line no-unused-expressions
        expect(bookingSystem.bookOnlineLink).to.be.undefined;
      });

      it('should return the GPs website address for a booking system that ends in (I)', () => {
        const gpData = getBaseGpData();
        gpData.contact = { website: gpWebsite };
        const bookingSystemData = getBaseBookingSystemData('NEW SYSTEM (I)');

        const bookingSystem = utils.getBookingSystem(gpData, bookingSystemData);

        // eslint-disable-next-line no-unused-expressions
        expect(bookingSystem).to.not.be.undefined;
        expect(bookingSystem.bookOnlineLink).to.be.equal(gpWebsite);
      });
    });
  });
});
