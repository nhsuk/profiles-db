# Dockerised repo for MongoDB, containing GP profile data

[![Build Status](https://travis-ci.org/nhsuk/profiles-db.svg?branch=master)](https://travis-ci.org/nhsuk/profiles-db)

## Running the container

Use `docker-compose up --build --force-recreate` to run the container.

A MongoDB 3.4 instance with the following properties will be running:

| Property   | Value        |
|:-----------|:-------------|
| database   | profiles     |
| collection | gps          |
| port       | 27017        |

The data is loaded from the `/data` directory.

## Docker images

Each successful build will result in an image being pushed to Docker Hub. They are available at [nhsuk/profiles-db](https://hub.docker.com/r/nhsuk/profiles-db/). Pull Requests created via GitHub result in an image tagged as `pr-{PR#}` e.g PR #9 would result in an image tag of `pr-9`.
When PRs are merged into the main branch i.e. `master` images are tagged with both `master` and `latest`.

## Merging data from multiple sources

Currently there are 2 sources of data:
* GP data from the NHSChoices syndication feed. Handled by [gp-data-etl](https://github.com/nhsuk/gp-data-etl)
* Patient Online Management Information (POMI) data from NHSDigital's indicator portal. Handled by [pomi-data-etl](https://github.com/nhsuk/pomi-data-etl)

The output from each process is added to `./input`. Executing `./app.js` will create a merged data set and save it in `./data` from where it will be loaded into the database.

## Data structure

An example of the structure of the data stored in MongoDB can be found in the [Sample GP Data](sample-gp-data.json)

The more interesting sub objects are described below

### Address

The `address` member consists of an array of `addressLines` and a `postcode`. The member is always present and there will always be a `postcode` and at least one `addressLine`.

### Location

The `location` member consists of a `type` member that is always `Point`, and `latitude` and `longitude` members that are numbers. These members are always present.

### Contact

The `contact` member may include `telephone`, `fax` or `email`. The `contact` member is always present, but all sub-members are optional.

### Opening times

The `openingTimes` member may contain a `reception` and `surgery` sub-member.

The sub-objects have members `sunday`, `monday`, `tuesday`, `wednesday`, `thursday`, `friday` and `saturday`. If a `reception` and `surgery` member exists, all of the days of the week will be populated.

A day member will contain an array of objects with `open` and `closes` members. An empty array means it is not open that day. The `open` and `closes` times are strings in the 24 hour format, i.e. `18:30`.

The `openingTimes` member is optional, as are the `reception` and `surgery` sub-members.

### Gp counts

The `gpCounts` members will either contain both a `male` and `female` member, or a single `unknown` member, never all three. The member will always be present, and the sub-members will always contain a number.

### Doctors

The `doctors` member is always present and contains an array of strings. It may be an empty array.

### Supplier

The `supplier` member is optional. When present it will contain a string representing the GP's booking system supplier. GP booking system supplier values are one of `["EMIS","EMIS (I)","INPS","INPS (I)","Informatica","Microtest","NK","TPP"]`

## Interrogating the json with [jq](https://stedolan.github.io/jq/)

* List suppliers: `jq -c 'unique_by(.Supplier) | [.[].Supplier]' input/pomi.json`
* Find single item by `odsCode`: `jq 'select(.[].odsCode == "${odsCode}")' data/gp-data-merged.json`

