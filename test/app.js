const fs = require('fs');
const chai = require('chai');
require('../app');

const expect = chai.expect;

function expectSupplierToBeValid(supplier) {
  const validSuppliers = [
    'EMIS',
    'INPS',
    'Informatica',
    'Microtest',
    'NK',
    'TPP'
  ];

  if (supplier.indexOf('(I)') > 0) {
    expect(supplier).to.have.string('(I)');
  } else {
    expect(supplier).to.be.oneOf(validSuppliers);
  }
}

describe('app', function () {
  this.timeout(3000);
  let gpJson;
  let mergedJson;
  let mergedData;

  before('load the files and convert to JSON', () => {
    const gpData = fs.readFileSync('./input/gp-data.json', 'utf8');
    mergedData = fs.readFileSync('./data/gp-data-merged.json', 'utf8');

    gpJson = JSON.parse(gpData);
    mergedJson = JSON.parse(mergedData);
  });

  describe('the merged file', () => {
    const suppliersWithKnownLink = [
      'EMIS',
      'INPS',
      'Informatica',
      'Microtest',
      'TPP'
    ];

    it('should produce a merged file with the same number of records as the gp-data file', () => {
      expect(gpJson.length).to.equal(mergedJson.length);
    });

    it('should have objects with required members', () => {
      mergedJson.forEach((item) => {
        const requiredKeys = [
          '_id',
          'address',
          'choicesId',
          'contact',
          'doctors',
          'gpCounts',
          'location',
          'name',
          'odsCode',
          'syndicationId'
        ];
        expect(item).to.contain.all.keys(requiredKeys);
      });
    });

    describe('members with a booking system', () => {
      const filterBookingSystem = item => item.bookingSystem;

      it('should have some results once the filter has been applied', () => {
        const filteredSet = new Set();
        const bookingItemsLength = JSON.parse(fs.readFileSync('./input/booking.json', 'utf8')).length;
        const nintyPercentOfRawRecords = bookingItemsLength * 0.9;

        mergedJson.filter(filterBookingSystem)
        .forEach((item) => {
          filteredSet.add(item.odsCode);
        });

        expect(filteredSet.size).is.at.least(nintyPercentOfRawRecords);
      });

      it('should have a valid supplier', () => {
        mergedJson
          .filter(filterBookingSystem)
          .forEach((item) => {
            const supplier = item.bookingSystem.supplier;
            expectSupplierToBeValid(supplier);
          });
      });

      it('should have a bookOnlineLink for those suppliers with known links', () => {
        mergedJson
          .filter(filterBookingSystem)
          .filter(item => suppliersWithKnownLink.indexOf(item.bookingSystem.supplier) > -1)
          .forEach((filtered) => {
            // eslint-disable-next-line no-unused-expressions
            expect(filtered.bookingSystem.bookOnlineLink).to.not.be.undefined;
          });
      });
    });

    describe('members with an online services booking system', () => {
      const filterOnlineServicesAppointments = item => item.onlineServices.appointments;

      it('should have some results once the filter has been applied', () => {
        const filteredSet = new Set();
        const bookingItemsLength = JSON.parse(fs.readFileSync('./input/booking.json', 'utf8')).length;
        const nintyPercentOfRawRecords = bookingItemsLength * 0.9;

        mergedJson.filter(filterOnlineServicesAppointments)
        .forEach((item) => {
          filteredSet.add(item.odsCode);
        });

        expect(filteredSet.size).is.at.least(nintyPercentOfRawRecords);
      });

      it('should have a valid supplier', () => {
        mergedJson.filter(filterOnlineServicesAppointments)
          .forEach((item) => {
            const supplier = item.onlineServices.appointments.supplier;
            expectSupplierToBeValid(supplier);
          });
      });

      it('should have a bookOnlineLink for those suppliers with known links', () => {
        mergedJson
          .filter(filterOnlineServicesAppointments)
          .filter(item =>
            suppliersWithKnownLink.indexOf(item.onlineServices.appointments.supplier) > -1)
          .forEach((filtered) => {
            // eslint-disable-next-line no-unused-expressions
            expect(filtered.bookingSystem.bookOnlineLink).to.not.be.undefined;
          });
      });
    });

    describe('members with an online repeat prescription system', () => {
      const filterScripts = item => item.onlineServices.repeatPrescriptions;

      it('should have some results once the filter has been applied', () => {
        const filteredSet = new Set();
        const scriptItemsLength = JSON.parse(fs.readFileSync('./input/scripts.json', 'utf8')).length;
        const nintyPercentOfRawRecords = scriptItemsLength * 0.9;

        mergedJson.filter(filterScripts)
        .forEach((item) => {
          filteredSet.add(item.odsCode);
        });

        expect(filteredSet.size).is.at.least(nintyPercentOfRawRecords);
      });

      it('should have a valid supplier', () => {
        mergedJson
          .filter(filterScripts)
          .forEach((item) => {
            const supplier = item.onlineServices.repeatPrescriptions.supplier;
            expectSupplierToBeValid(supplier);
          });
      });

      it('should have a link for those suppliers with known links', () => {
        mergedJson
          .filter(filterScripts)
          .filter(item =>
            suppliersWithKnownLink.indexOf(item.onlineServices.repeatPrescriptions.supplier) > -1)
          .forEach((filtered) => {
            // eslint-disable-next-line no-unused-expressions
            expect(filtered.onlineServices.repeatPrescriptions.url).to.not.be.undefined;
          });
      });
    });

    describe('members with an online coded records access system', () => {
      const filterCodedRecords = item => item.onlineServices.codedRecords;

      it('should have some results once the filter has been applied', () => {
        const filteredSet = new Set();
        const codedRecordsLength = JSON.parse(fs.readFileSync('./input/records.json', 'utf8')).length;

        mergedJson.filter(filterCodedRecords)
        .forEach((item) => {
          filteredSet.add(item.odsCode);
        });
        const nintyPercentOfRawRecords = codedRecordsLength * 0.9;

        expect(filteredSet.size).is.at.least(nintyPercentOfRawRecords);
      });

      it('should have a valid supplier', () => {
        mergedJson
          .filter(filterCodedRecords)
          .forEach((item) => {
            const supplier = item.onlineServices.codedRecords.supplier;
            expectSupplierToBeValid(supplier);
          });
      });

      it('should have a link for those suppliers with known links', () => {
        mergedJson
          .filter(filterCodedRecords)
          .filter(item =>
            suppliersWithKnownLink.indexOf(item.onlineServices.codedRecords.supplier) > -1)
          .forEach((filtered) => {
            // eslint-disable-next-line no-unused-expressions
            expect(filtered.onlineServices.repeatPrescriptions.url).to.not.be.undefined;
          });
      });
    });
  });
});
