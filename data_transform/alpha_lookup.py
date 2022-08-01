import os
import csv
import json

infilename = 'systemic_risk_clean.csv'

output = {}

with open(os.path.join('input', infilename)) as infile:

    reader = csv.reader(infile)

    headers = next(reader)

    for r in reader:

        location = r[0].lower()
        mode = r[1].lower()
        exposure = r[2].lower()
        functional = r[3].lower()
        crash = float(r[9])
        injury = float(r[10])
        death = float(r[11])

        if location not in output:
            output[location] = {}

        if mode not in output[location]:
            output[location][mode] = {}

        if exposure not in output[location][mode]:
            output[location][mode][exposure] = {}

        output[location][mode][exposure][functional] = {
            'crash': crash,
            'injury': injury,
            'death': death,
        }

json.dump(output, open(os.path.join('output', 'alpha_lookup.json'), 'w'))

