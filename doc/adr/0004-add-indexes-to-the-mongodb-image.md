# 4. Add Indexes to the MongoDB image

Date: 2017-03-21

## Status

Accepted

## Context

A spike has been done to check if the image can be layered, i.e. have the base image and then add the index as another layer, so
the different applications would only use the image with the functionality they need.
Unfortunately, due to the volatility of the data layer, another layer cannot modify it without making a copy, which is unsustainable.

## Decision

The base image had indexes added to it as even though not all the client applications needed them, the overhead was minimal.

## Consequences

Keeping a single source of truth for the data for both the client applications with the added search functionality.
