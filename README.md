# NDC API

This project is a simple API for the FDA's NDC database. 

## Prerequisites

- Docker 17.12

## Installation

- Copy config/secrets.dist.env to config/secrets.env and set values for all the environment variables.

Run the following commands:

```
docker-compose -f services.yml run --rm npm install
docker-compose up -d db
```

After the database container starts, wait 10-30 seconds for mysql to actually start. 

Finally, run:

```
docker-compose -f services.yml run --rm updateSchema
docker-compose up -d api
```

To seed the data in the database, send a POST request to http://host/api/Drugs/updateData. This will take a while, as there are currently 230k drugs to organize and insert.

Ultimately, the fetching and processing of the FDA CSV data will be automated. Until then, if you want newer drugs in the system, you'll have to download and pre-process the CSV file. If you choose to go this route, you must delete the following columns from the CSV:

- LABELERNAME
- ACTIVE_NUMERATOR_STRENGTH	
- ACTIVE_INGRED_UNIT	
- PHARM_CLASSES	

These columns have incredibly long strings, and their inclusion makes the current csv parsing library freak out about heap size and die a terrible death. This will be addressed in future versions.

The data is contained in ./app/data/

Access the API explorer at https://host:port/explorer

The default port for loopback is 3001. 
