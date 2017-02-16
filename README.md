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

