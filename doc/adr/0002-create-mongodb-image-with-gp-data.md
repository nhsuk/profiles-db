# 2. Create MongoDB image with GP data

Date: 2017-02-17

## Status

Accepted

## Context

We have used the technique of bundling the data from an import script with the MongoDB image before in Pharmacy DB 
so went with this solution.

## Decision

The MongoDB images will be built with the data on start and will be available for consumption by other apps.

## Consequences

There is one source of information for GP data that can be easily consumed. Changes/data loads will happen in one place 
as the information becomes available from the ETL.
