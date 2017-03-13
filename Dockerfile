FROM mongo:3.4

# Modify child mongo to use /data/db2 as dbpath (because /data/db wont persist the build)
RUN mkdir -p /data/db2 \
    && chown -R mongodb:mongodb /data/db2

COPY data/ /temp/
COPY etc/ /etc/

RUN mongod --fork --logpath /var/log/mongodb.log --config /etc/mongodb.conf \
    && mongoimport --jsonArray -d profiles -c gps --file /temp/gp-data-merged.json \
    && mongod --config /etc/mongodb.conf --shutdown \
    && chown -R mongodb /data/db2

# Make the new dir a VOLUME to persists it
VOLUME /data/db2

CMD ["mongod", "--config", "/etc/mongodb.conf"]

