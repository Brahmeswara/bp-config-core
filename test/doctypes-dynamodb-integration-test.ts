import * as assert from "assert";
import {expect} from "chai";
import {fail} from "assert";
import {DocTypeItemKey, DocTypeItem} from './../src-ts/core/models/doctypes';

const container = require('./../src-ts/utils/app-config');
const {Logger} = require('@docudata/common-utils');
const logger = new Logger('doctypes-dynamodb-integration-tests');


const testDocType1: DocTypeItem = {
    bpPK : "doctypes",
    bpSK: 'Deed Initial',
    description: 'iniital deed',
    grp : 'Closing',
    cBy: 'brahmeswara@yahoo.com',
    uBy: 'brahmeswara@yahoo.com',
    cAt:  new Date().toDateString(),
    uAt: new Date().toDateString()
};

const testDocType2: DocTypeItem = {
  bpPK : "doctypes",
  bpSK: 'W-2',
  description: 'W-2',
  grp: 'Income',
  cBy: 'brahmeswara@yahoo.com',
  uBy: 'brahmeswara@yahoo.com',
  cAt:  new Date().toDateString(),
  uAt: new Date().toDateString()
};

const testDocType1Key: DocTypeItemKey = {
  'bpPK' : "doctypes",
  'bpSK': 'Deed Initial'
};

const testDoctype2Key: DocTypeItemKey = {
  'bpPK' : "doctypes",
  'bpSK': 'W-2'
};

var updateTestPayload: any = {
  'description' : 'updated desc for W-2 update test..',
  'grp'   : 'Income',
  'uBy'   : 'brahmeswara@yahoo.com',
  'uAt'   : new Date().toDateString(),
  'userName'    : 'brahmeswara@yahoo.com'
};

const testDocType2Updated: DocTypeItem = {
  'bpPK' : testDocType2.bpPK,
  'bpSK':  testDocType2.bpSK,
  'description' : updateTestPayload.description,
  'grp'   : 'Income',
  'uBy'   : updateTestPayload.userName,
  'uAt'   : updateTestPayload.uAt,
  'cAt'   : testDocType2.cAt,
  'cBy'   : testDocType2.cBy
};

describe('DocTypes-DynamoDB', () => {

    const dynamoRepo = container.docTypeRepository;

    it('create: create new doc type', async () => {

      const result = await dynamoRepo.create(testDocType1);
      expect(result).to.deep.equal(testDocType1);
    });

    it('create: create another new doc type', async () => {

      const result = await dynamoRepo.create(testDocType2);
      expect(result).to.deep.equal(testDocType2);
    });

    it('get: get a doc type record', async () => {
      const result = await dynamoRepo.get(testDocType1Key);
      expect(result).to.deep.equal(testDocType1);
    });

    it('update: update an existing doc type', async () => {
      const result = await dynamoRepo.update(testDocType2Updated);
      logger.debug('res: ', JSON.stringify(result));
      logger.debug('desc: ', result.Attributes.description)
      expect(result.Attributes.description).to.deep.equal(testDocType2Updated['description']);
    });

    it('get: updated record and check', async () => {
      const result = await dynamoRepo.get(testDoctype2Key);
      expect(result.description).to.deep.equal(testDocType2Updated['description']);
    });
    
    it('list: grt all groups', async () => {
      
      const result = await dynamoRepo.list();
      expect(result).to.have.lengthOf.above(0);
    });

})