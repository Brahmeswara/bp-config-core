## Docudata Config App Business Logic
This package contains the docudata configuration application business logic along with the
data source implmenetaton. It has

* business entity named "groups" defined in src-ts/core/models
* repository interface define in src-ts/core/repository
* business use cases implemenations in src-ts/core/services

Datasource adaptor for AWS dynamodB is implementd at src-ts/datasources/groups-dynamodb.ts

Application configuration is using utils/app-confis.ts. This is mainly used for integration testing purposes only.

## Building

npm run build

## Running unit test casses

npm run unit-test

## Integration testing 

This is mainly to test datasource implemenation with database.

npm run cleanup-db

npm run integration-test

## Publishing the package
npm publish 

`NOTE`: by default, my npm repo is set to AWS Codeartifact. new packages would be published to AWS Codeartifact.





