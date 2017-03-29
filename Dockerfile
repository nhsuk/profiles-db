FROM mongo:3.4

# Modify child mongo to use /data/db2 as dbpath (because /data/db wont persist the build)
RUN mkdir -p /data/db2 \
    && chown -R mongodb:mongodb /data/db2

COPY data/ /temp/
COPY etc/ /etc/

RUN mongod --fork --logpath /var/log/mongodb.log --config /etc/mongodb.conf \
    && mongoimport --jsonArray -d profiles -c gps --file /temp/gp-data-merged.json \
    # Populate the searchWords field with words from the address and name with duplicates and punctuation removed
    && mongo profiles --eval "db.gps.find().snapshot().forEach(function (gp) { gp.searchWords = gp.address.addressLines.concat([gp.address.postcode, gp.name]).join(' ').toLowerCase().replace(/[^\w\s]/g,'').replace(/\s+/g,' ').split(' ').filter(function(item, pos, self) { return self.indexOf(item) == pos; }).join(' '); db.gps.save(gp);} )" \
    && mongo profiles --eval "db.gps.createIndex({ 'name': 'text', 'searchWords': 'text'}, { weights: { name: 5, searchWords: 10 } }, {name: 'SearchIndex'})" \
    && mongod --config /etc/mongodb.conf --shutdown \
    && chown -R mongodb /data/db2

# Make the new dir a VOLUME to persists it
VOLUME /data/db2

CMD ["mongod", "--config", "/etc/mongodb.conf"]

