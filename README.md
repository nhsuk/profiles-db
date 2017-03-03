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

## Data structure
An example of the structure of the data stored in MongoDB can be found in the [Sample GP Data](sample-gp-data.json)

The more complex sub objects are described below

### Address

The `address` field consists of an array of `addressLines` and a `postcode`. The field is always present and there will always be a `postcode` and at least one `addressLine`.

### Location

The `location` field consists of a `type` field that is always `Point`, and `latitude` and `longitude` fields that are numbers. These fields are always present.

### Contact

The `contact` field may include `telephone`, `fax` or `email`. The `contact` field is always present, but all sub-fields are optional.

### Opening times

The `openingTimes` field may contain a `reception` and `surgery` sub-field.

The sub-objects have fields `sunday`, `monday`, `tuesday`, `wednesday`, `thursday`, `friday` and `saturday`. If a `reception` and `surgery` field exists, all of the days of the week will be populated.

A day field will contain an array of objects with `open` and `closes` fields. An empty array means it is not open that day. The `open` and `closes` times are strings in the 24 hour format, i.e. `18:30`.

The `openingTimes` field is optional, as are the `reception` and `surgery` sub-fields.

### Gp counts

The `gpCounts` fields will either contain both a `male` and `female` field, or a single `unknown` field, never all three. The field will always be present, and the sub-fields will always contain a number.

### Doctors

The `doctors` field is always present and contains an array of strings. It may be an empty array.





