const chai = require('chai');
const systems = require('../lib/systems');

const expect = chai.expect;

describe('systems', () => {
  describe('getRepeatPrescriptionSystem', () => {
    const odsCode = 'A12345';
    const gpWebsite = 'http://gp.website.com';

    function getBaseOnlineSystemData(supplier) {
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
        const systemData = getBaseOnlineSystemData();

        const system = systems.getRepeatPrescriptionSystem(gpData, systemData);

        // eslint-disable-next-line no-unused-expressions
        expect(system).to.not.be.undefined;
        expect(system.url).to.be.equal(gpWebsite);
      });
    });

    describe('for known systems', () => {
      it('should return the suppliers system address for EMIS', () => {
        const gpData = getBaseGpData();
        const systemData = getBaseOnlineSystemData('EMIS');

        const system = systems.getRepeatPrescriptionSystem(gpData, systemData);

        // eslint-disable-next-line no-unused-expressions
        expect(system).to.not.be.undefined;
        expect(system.url)
          .to.be.equal('https://patient.emisaccess.co.uk/prescriptions/request');
      });

      it('should return the suppliers system address for INPS', () => {
        const gpData = getBaseGpData();
        const systemData = getBaseOnlineSystemData('INPS');

        const system = systems.getRepeatPrescriptionSystem(gpData, systemData);

        // eslint-disable-next-line no-unused-expressions
        expect(system).to.not.be.undefined;
        expect(system.url)
          .to.be.equal('https://www.patient-services.co.uk/web/ps/login');
      });

      it('should return the suppliers system address for Informatica', () => {
        const gpData = getBaseGpData();
        const systemData = getBaseOnlineSystemData('Informatica');

        const system = systems.getRepeatPrescriptionSystem(gpData, systemData);

        // eslint-disable-next-line no-unused-expressions
        expect(system).to.not.be.undefined;
        expect(system.url)
          .to.be.equal('https://www.patient-services.co.uk/web/ps/login');
      });

      it('should return the suppliers system address for Microtest', () => {
        const gpData = getBaseGpData();
        const systemData = getBaseOnlineSystemData('Microtest');

        const system = systems.getRepeatPrescriptionSystem(gpData, systemData);

        // eslint-disable-next-line no-unused-expressions
        expect(system).to.not.be.undefined;
        expect(system.url)
          .to.be.equal('https://www.thewaiting-room.net/');
      });

      it('should return the GPs website address for NK', () => {
        const gpData = getBaseGpData();
        gpData.contact = { website: gpWebsite };
        const systemData = getBaseOnlineSystemData('NK');

        const system = systems.getRepeatPrescriptionSystem(gpData, systemData);

        // eslint-disable-next-line no-unused-expressions
        expect(system).to.not.be.undefined;
        expect(system.url).to.be.equal(gpWebsite);
      });

      it('should return undefined when no GP website is available for NK', () => {
        const gpData = getBaseGpData();
        const systemData = getBaseOnlineSystemData('NK');

        const system = systems.getRepeatPrescriptionSystem(gpData, systemData);

        // eslint-disable-next-line no-unused-expressions
        expect(system).to.not.be.undefined;
        // eslint-disable-next-line no-unused-expressions
        expect(system.url).to.be.undefined;
      });

      it('should return the suppliers system address for TPP', () => {
        const gpData = getBaseGpData();
        const systemData = getBaseOnlineSystemData('TPP');

        const system = systems.getRepeatPrescriptionSystem(gpData, systemData);

        // eslint-disable-next-line no-unused-expressions
        expect(system).to.not.be.undefined;
        expect(system.url)
          .to.be
          .equal(`https://systmonline.tpp-uk.com/Login?PracticeId=${odsCode}`);
      });
    });

    describe('for unknown systems', () => {
      it('should return undefined when no GP website is available', () => {
        const gpData = getBaseGpData();
        const systemData = getBaseOnlineSystemData('EMIS (I)');

        const system = systems.getRepeatPrescriptionSystem(gpData, systemData);

        // eslint-disable-next-line no-unused-expressions
        expect(system).to.not.be.undefined;
        // eslint-disable-next-line no-unused-expressions
        expect(system.url).to.be.undefined;
      });

      it('should return the GPs website address for a booking system that ends in (I)', () => {
        const gpData = getBaseGpData();
        gpData.contact = { website: gpWebsite };
        const systemData = getBaseOnlineSystemData('NEW SYSTEM (I)');

        const system = systems.getRepeatPrescriptionSystem(gpData, systemData);

        // eslint-disable-next-line no-unused-expressions
        expect(system).to.not.be.undefined;
        expect(system.url).to.be.equal(gpWebsite);
      });
    });
  });
});
