# 3. Merge POMI data into the image via Node

Date: 2017-03-13

## Status

Accepted

## Context

There are 2 sources of data:
* GP data from the NHSChoices syndication feed. Handled by [gp-data-etl](https://github.com/nhsuk/gp-data-etl)
* Patient Online Management Information (POMI) data from NHSDigital's indicator portal. Handled by [pomi-data-etl](https://github.com/nhsuk/pomi-data-etl)
These two files needed to be merged in before they can be loaded in the application.

## Decision

Node.js was used to perform the merge of the two data sources and then the usual Dockerisation of the image and the new 
json file as originally intended

## Consequences

We have proved that there is a sustainable way to add multiple data sources to our data store solution in order to
fulfill the requirements of the client apps.

