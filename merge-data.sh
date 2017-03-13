#!/usr/bin/env bash

printf "Remapping data files: Start\n"
printf "Remapping: input/pomi.json\n"
# Create new file with key that can be mapped to in 'gp-data.json' i.e. 'odsCode
jq '[.[] | { odsCode: .GPPracticeCode, supplier: .Supplier }]' input/pomi.json > input/remapped-suppliers.json
printf "Remapping data files: Finish\n"

printf "Merging data files: Start\n"
printf "Merging: input/gp-data.json + input/remapped-suppliers.json => data/gp-data-merged.json\n"
# Merge the two files, producing an output of an array of objects with additional member 'supplier'
jq -s '.[0] as $gps | .[1] as $suppliers | $gps + $suppliers | group_by(.odsCode) | map(add)' input/gp-data.json input/remapped-suppliers.json > data/gp-data-merged.json
printf "Merging data files: Finish\n"

printf "Removing temp files: Start\n"
rm input/remapped-suppliers.json
printf "Removing temp files: Finish\n"
