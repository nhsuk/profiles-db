const fs = require('fs');
const chai = require('chai');
require('../app');

const expect = chai.expect;

describe('app', () => {
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
  });
});
