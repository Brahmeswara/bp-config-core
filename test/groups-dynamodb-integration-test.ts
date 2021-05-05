//import {GroupsDynamodbRepo} from "./../src-ts/datasources/groups-dynamodb";

import * as assert from "assert";
import {expect} from "chai";
import {fail} from "assert";
import {GroupItemKey, GroupItem} from './../src-ts/core/models/groups';

const container = require('./../src-ts/utils/app-config');
const {Logger} = require('@docudata/common-utils');
const logger = new Logger('goups-dynamodb-integration-tests');

const testGrp: GroupItem = {
    'base-pk' : "groups",
    'base-sk': 'Closing',
    description: 'Closing process related documents',
    createdBy: 'brahmeswara@yahoo.com',
    updatedBy: 'brahmeswara@yahoo.com',
    createdAt:  new Date().toDateString(),
    updatedAt: new Date().toDateString()
};

const testGrpKey: GroupItemKey = {
  'base-pk' : "groups",
  'base-sk': 'Closing'
};


const testGrp2: GroupItem = {
  'base-pk' : "groups",
  'base-sk': 'Mortgage',
  description: 'Mortgage process related documents',
  createdBy: 'brahmeswara@yahoo.com',
  updatedBy: 'brahmeswara@yahoo.com',
  createdAt:  new Date().toDateString(),
  updatedAt: new Date().toDateString()
};

const testGrpKey2: GroupItemKey = {
  'base-pk' : "groups",
  'base-sk': 'Mortgage'
};

const updatedPayload: any = {
  description: 'updated desc - Mortgage process related documents',
  createdBy: 'brahmeswara@yahoo.com',
  updatedBy: 'brahmeswara@yahoo.com',
  createdAt:  new Date().toDateString(),
  updatedAt: new Date().toDateString()
};

const doesNotExistsKey: GroupItemKey = {
  'base-pk' : "groups",
  'base-sk': 'should be be there'
};


describe('Groups-DynamoDB', () => {
  
  describe('Groups-DynamoDB', () => {

    const dynamoRepo = container.groupsRepository;

    it('create: create new record', async () => {

      const result = await dynamoRepo.create(testGrp);
      expect(result).to.deep.equal(testGrp);
    });

    it('create: create same record again', async () => {

      try {
        await dynamoRepo.create(testGrp);
      }
      catch (error) {
        expect(error.toString()).to.equal("Error: Reject");
      }
    });

    it('create: create 2nd record', async () => {

      const result = await dynamoRepo.create(testGrp2);
      expect(result).to.deep.equal(testGrp2);
    });


    it('get: is successful', async () => {
      const result = await dynamoRepo.get(testGrpKey);
      expect(result).to.deep.equal(testGrp);
    });

    it('update: is successful', async () => {
      const result = await dynamoRepo.update(testGrpKey2, updatedPayload);
      logger.debug('res: ', JSON.stringify(result));
      logger.debug('desc: ', result.Attributes.description)
      expect(result.Attributes.description).to.deep.equal(updatedPayload['description']);
    });


    it('get: updated record and check', async () => {
      const result = await dynamoRepo.get(testGrpKey2);
      expect(result.description).to.deep.equal(updatedPayload['description']);
    });
    
    it('list: grt all groups', async () => {
      
      const result = await dynamoRepo.list();
      expect(result).to.have.lengthOf.above(0);
    });

  });

});
