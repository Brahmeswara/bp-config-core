//import {GroupsDynamodbRepo} from "./../src-ts/datasources/groups-dynamodb";

import * as assert from "assert";
import {expect} from "chai";
import {fail} from "assert";
import {GroupItemKey, GroupItem} from './../src-ts/core/models/groups';

const container = require('./../src-ts/utils/app-config');
const {Logger} = require('@docudata/common-utils');
const logger = new Logger('goups-dynamodb-integration-tests');

const testGrp: GroupItem = {
    'bpPK' : "groups",
    'bpSK': 'Closing',
    description: 'Closing process related documents',
    cBy: 'brahmeswara@yahoo.com',
    uBy: 'brahmeswara@yahoo.com',
    cAt:  new Date().toDateString(),
    uAt: new Date().toDateString()
};

const testGrpKey: GroupItemKey = {
  'bpPK' : "groups",
  'bpSK': 'Closing'
};


const testGrp2: GroupItem = {
  'bpPK' : "groups",
  'bpSK': 'Mortgage',
  description: 'Mortgage process related documents',
  cBy: 'brahmeswara@yahoo.com',
  uBy: 'brahmeswara@yahoo.com',
  cAt:  new Date().toDateString(),
  uAt: new Date().toDateString()
};

const testGrpKey2: GroupItemKey = {
  'bpPK' : "groups",
  'bpSK': 'Mortgage'
};

const testGrp2Updated: any = {
  'bpPK' : "groups",
  'bpSK': 'Mortgage',
  description: 'updated desc - Mortgage process related documents',
  cBy: 'brahmeswara@yahoo.com',
  uBy: 'brahmeswara@yahoo.com',
  cAt:  new Date().toDateString(),
  uAt: new Date().toDateString()
};

const doesNotExistsKey: GroupItemKey = {
  'bpPK' : "groups",
  'bpSK': 'should be be there'
};


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
      const result = await dynamoRepo.update(testGrp2Updated);
      logger.debug('res: ', JSON.stringify(result));
      logger.debug('desc: ', result.Attributes.description)
      expect(result.Attributes.description).to.deep.equal(testGrp2Updated['description']);
    });


    it('get: updated record and check', async () => {
      const result = await dynamoRepo.get(testGrpKey2);
      expect(result.description).to.deep.equal(testGrp2Updated['description']);
    });
    
    it('list: grt all groups', async () => {
      
      const result = await dynamoRepo.list();
      expect(result).to.have.lengthOf.above(0);
    });

  });
