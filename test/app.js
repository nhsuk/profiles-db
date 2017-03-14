const fs = require('fs');
const chai = require('chai');
require('../app');

const expect = chai.expect;

describe('app', () => {
  it('should produce a merged file with the same number of records as the gp-data file', () => {
    const gpData = fs.readFileSync('./input/gp-data.json');
    const mergedData = fs.readFileSync('./data/gp-data-merged.json');

    const gpJson = JSON.parse(gpData);
    const mergedJson = JSON.parse(mergedData);

    expect(gpJson.length).to.equal(mergedJson.length);
  });
});
