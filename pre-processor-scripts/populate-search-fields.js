/* eslint no-extend-native: ["error", { "exceptions": ["String"] }] */

/* Note: native extension is generally a 'Bad Thing'(tm) but in this instance I'd argue it is OK as:
 * 1) the code has very limited scope (i.e. it is for use within MongoDB only and
 *    not in a module or for use in a browser)
 * 2) the script is very small, well defined and native extension improves legibility.
 * 3) it will be shortlived given our move to ElasticSearch */

String.prototype.removePunctuation = function removePunctuation() {
  return this.replace(/[.,]/g, '');
};

String.prototype.removeStopWords = function removeStopWords() {
  return this.replace(/\b(drs?|doctors?)\b/ig, '');
};

String.prototype.removeDuplicates = function removeDuplicates() {
  return this
    .split(' ')
    .filter((item, pos, self) => self.indexOf(item) === pos)
    .join(' ');
};

function cleanse(searchFields) {
  return searchFields
    .join(' ')
    .toLowerCase()
    .removePunctuation()
    .removeStopWords()
    .removeDuplicates()
    .trim();
}

/* global db:true */

db.gps.find().snapshot()
  .forEach(
    (gp) => {
      /* eslint-disable no-param-reassign */
      gp.searchSurgery = cleanse(gp.address.addressLines.concat([gp.name, gp.address.postcode]));
      gp.searchDoctors = cleanse(gp.doctors);
      gp.searchName = cleanse([gp.name]);
      /* eslint-endisable no-param-reassign */
      db.gps.save(gp);
    }
  );

db.gps.createIndex(
  { searchName: 'text', searchSurgery: 'text', searchDoctors: 'text' },
  { weights: { searchName: 1, searchSurgery: 2, searchDoctors: 1 }, default_language: 'none', name: 'SearchIndex' }
);
