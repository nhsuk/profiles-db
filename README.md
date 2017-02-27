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

## Git hooks

It is possible to execute scripts automatically at several points of the Git
lifecycle. These are called [Git hooks](https://git-scm.com/docs/githooks).
In order to benefit from the hooks setup for this repo run
`git config --add core.hooksPath .githooks`
This will set the path where Git checks for hooks to run to `.githooks`. No
existing hooks will be changed, however, they will also no longer run.
To confirm the change was successful, run
`git config --get core.hooksPath`, the response should be `.githooks`.

