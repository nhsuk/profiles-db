/* eslint-disable */
/* Since mongo does not support ES6 we can not lint with our current eslint config */

String.prototype.removePunctuation = function () {
    return this.replace(/[.,]/g,'');
};

String.prototype.removeStopWords = function () {
    return this.replace(/\b(drs?|doctors?)\b/ig,'');
};

String.prototype.removeDuplicates = function () {
  return this
    .split(' ')
    .filter(function(item, pos, self) { return self.indexOf(item) == pos })
    .join(' ');
};

const cleanse = function(searchFields) {
  return searchFields 
    .join(' ')
    .toLowerCase()
    .removePunctuation()
    .removeStopWords()
    .removeDuplicates()
    .trim();
}

db.gps.find().snapshot()
  .forEach(
    function (gp) { 
      gp.searchSurgery = cleanse(gp.address.addressLines.concat([gp.name, gp.address.postcode]));
      gp.searchDoctors = cleanse(gp.doctors);
      gp.searchName = cleanse([gp.name]);
      db.gps.save(gp);
    }
  )

db.gps.createIndex(
  { 'searchName': 'text', 'searchSurgery': 'text', 'searchDoctors': 'text'},
  { weights: {'searchName': 1, 'searchSurgery': 2, 'searchDoctors': 1}, 'default_language': 'none', 'name': 'SearchIndex'}
)
