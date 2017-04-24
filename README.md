# Dockerised repo for MongoDB, containing GP profile data

[![Build Status](https://travis-ci.org/nhsuk/profiles-db.svg?branch=master)](https://travis-ci.org/nhsuk/profiles-db)
[![Known Vulnerabilities](https://snyk.io/test/github/nhsuk/profiles-db/badge.svg)](https://snyk.io/test/github/nhsuk/profiles-db)

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

Each successful build will result in an image being pushed to Docker Hub. They
are available at
[nhsuk/profiles-db](https://hub.docker.com/r/nhsuk/profiles-db/). Pull Requests
created via GitHub result in an image tagged as `pr-{PR#}` e.g PR #9 would
result in an image tag of `pr-9`.  When PRs are merged into the main branch
i.e. `master` images are tagged with both `master` and `latest`.

## Merging data from multiple sources

Currently there are 2 sources of data:
* GP data from the NHSChoices syndication feed. Handled by
  [gp-data-etl](https://github.com/nhsuk/gp-data-etl)
* Patient Online Management Information (POMI) data from NHSDigital's indicator
  portal. Handled by [pomi-data-etl](https://github.com/nhsuk/pomi-data-etl)

The output from each process is added to `./input`. Executing `npm start` will
create a merged data set and save it in `./data` from where it will be loaded
into the database.

## Data structure

An example of the structure of the data stored in MongoDB can be found in the
[Sample GP Data](sample-gp-data.json)

The more interesting members are described below:

### Display name

`displayName` contains the `name` member  adjusted to title case in an attempt
to fix names that have been entered in all capitals.

### Address

The `address` member consists of an array of `addressLines` and a `postcode`.
The member is always present and there will always be a `postcode` and at least
one `addressLine`.

### Location

The `location` member is a GeoJSON object. It consists of a `type` member that
is always `Point`, and a `coordinates` member that is an array of two numbers.
The first number is the `longitude`, the second number is the `latitude`. These
members are always populated.

### Contact

The `contact` member may include `telephone`, `fax`, `website`, or `email`. The
`contact` member is always present, but all sub-members are optional.
`website` will always have a protocol.

### Opening times

The `openingTimes` member may contain a `reception`, `surgery` and `alteration`
sub-member.

The `reception` and `surgery` members themselves have members `sunday`,
`monday`, `tuesday`, `wednesday`, `thursday`, `friday` and `saturday`. If a
`reception` and `surgery` member exists, all of the days of the week will be
populated.

A day member will contain an array of objects with `open` and `closes` members.
An empty array means it is not open that day. The `open` and `closes` times are
strings in the 24 hour format, i.e. `18:30`.

The `alteration` sub-object contains members for each date the practice opening
hours change from the standard. The date in the format `yyyy-MM-dd`, i.e.
`2017-12-25`. The array of objects contained in the member is the same
structure as the day member above.

The `openingTimes` member is optional, as are the `reception`, `surgery` and
`alteration` sub-members.

### GP counts

The `gpCounts` members will either contain both a `male` and `female` member,
or a single `unknown` member, never all three. The member will always be
present, and the sub-members will always contain a number.

### Doctors

The `doctors` member is always present and contains an array of strings. It may
be an empty array.

### Accepting new patients

The `acceptingNewPatients` member is always present and will contain `true` or
`false`.

### Online Services

The `onlineServices` member is always present, however, the contents of it are
optional. Optional members of `onlineServices` are:

#### Repeat Prescriptions

The `repeatPrescriptions` is an optional member of `onlineServices`. When
present it will contain an object consisting of a `supplier` member and an
optional `url` member (see below for more information on `supplier`).

#### Coded Records

The `codedRecords` is an optional member of `onlineServices`. When
present it will contain an object consisting of a `supplier` member and an
optional `url` member (see below for more information on `supplier`).

#### Appointments

The `appointments` is an optional member of `onlineServices`. When
present it will contain an object consisting of a `supplier` member and an
optional `url` member (see below for more information on `supplier`).

`supplier` is a string, representing the GP's supplier for the type of system
the member represents e.g. repeat prescription ordering system.
The value will be one of the suppliers listed below
`["EMIS","INPS","Informatica","Microtest","NK","TPP"]`. Or one of these values
with an `(I)` appended e.g. `EMIS (I)`. The addition of `(I)` represents a GP
that is now using the Informatica system.
`url` is a string representing the best link we know about to use for
accessing that GP's online system. It will be a direct link to the system or
the GP's website if the system is unknown. And no value is the GP's
website is unknown.

### Booking system

The `bookingSystem` member is optional. When present it will contain an object
consisting of a `supplier` member and an optional `bookOnlineLink` member.
`supplier` is a string, representing the GP's booking system supplier. The
value will be one of the suppliers listed below
`["EMIS","INPS","Informatica","Microtest","NK","TPP"]`. Or one of these values
with an `(I)` appended e.g. `EMIS (I)`. The addition of `(I)` represents a GP
that is now using the Informatica system.
`bookOnlineLink` is a string representing the best link we know about to use for
accessing that GP's online booking system. It will be the link to the booking
system or the GP's website if the system is unknown. And no value is the GP's
website is unknown.

### Facilities

The `facilities` member may contain `parking` or `accessibility` members. Each
of these members holds an array of objects with properties `name` and `exists`.
The `facilities` member is optional, as are the child members. When a child
member is present it will always contain at least one item, and the `name` and
`exists` members are always populated.

### Services

The `services` member is optional and may contain the members `epsEnabled`,
`moreInformaton`, or `entries`.  `epsEnabled` is optional and will be `true` if
the practice provides the Electronic Prescription Service.
`moreInformation` is optional free text.

The `entries` array is always present and contains objects with members
`title`, `code`, `availabilityTimes`, `introduction`, `gpReferralRequired` and
`deliverer`.  `code` is the unique id within Syndication for that particular
service type, i.e an `Asthma Clinic` is always `SVR0208` for all practices.
`availabilityTimes` is free text to hold any additional availability times
information.  `gpReferralRequired` will be either `true` or `false`.
`availabilityTimes` and `introduction` are optional.
All other members will be present and populated.

## Interrogating the json with [jq](https://stedolan.github.io/jq/)

* List suppliers: `jq -c 'unique_by(.Supplier) | [.[].Supplier]' input/pomi.json`
* Find single item by `odsCode`:
  `jq '.[] | select(.odsCode == "${odsCode}")' data/gp-data-merged.json`
