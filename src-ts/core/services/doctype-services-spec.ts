import {DocTypeService} from './doctype-services' ;

import * as assert from "assert";
import {expect} from "chai";
import {fail} from "assert";
import {DocTypeItem, DocTypeItemKey} from './../models/doctypes';
import {DocTypeRepositoryInterface } from '../respository/doctypes-repo'

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

const docTypeList: DocTypeItem[] = [testDocType1, testDocType2] ;

class MockRepo implements DocTypeRepositoryInterface {
  mockResult?: Promise<DocTypeItem>;
  mockResultList? : Promise<DocTypeItem[]>

  create (params: any) {
    assert.ok(this.mockResult);
    return this.mockResult!
    
  }

  async get (params: any) {
    assert.ok(this.mockResult);
    return this.mockResult!
  }

  async list ()
  {
    assert.ok(this.mockResultList);
    return this.mockResultList!;
  }

  async update (docTypeItem: DocTypeItem)
  {
    assert.ok(this.mockResult);
    //expect(grpItem).to.deep.equal(testGrpKey2);
    const updatedItem: DocTypeItem = docTypeItem;
    updatedItem.cAt = testDocType2.cAt;
    updatedItem.cBy = testDocType2.cBy;

    return updatedItem;
  }
}

describe('DocTypeService', () => {
    const mockRepo = new MockRepo();
 

    it('create: new doc type ', async () => {
        mockRepo.mockResult = Promise.resolve(testDocType1);
        const docTypeService = new DocTypeService(mockRepo);
     
        const request = {
          docTypeName: 'Deed Initial',
          description: 'iniital deed',
          grp : 'Closing',
          userName: 'brahmeswara@yahoo.com'
        }
        const result = await docTypeService.create(request);
        expect(result).to.deep.equal(testDocType1);
      });

    it('create: new doc type', async () => {
      mockRepo.mockResult = Promise.resolve(testDocType2);
      const docTypeService = new DocTypeService(mockRepo);
  
      const request = {
        docTypeName: 'W-2',
        grp: 'Income',
        description: 'W-2',
        userName: 'brahmeswara@yahoo.com'
      }
      const result = await docTypeService.create(request);
      expect(result).to.deep.equal(testDocType2);
    });

    it('get: null doc type', async () => {
      mockRepo.mockResult = Promise.resolve(testDocType1);
      const docTypeService = new DocTypeService(mockRepo);
      try  {
        const result = await docTypeService.get(null);
  
      } catch (err)
      {
        expect(err.toString()).to.equal("Error: DocTypeServices: get: provide doc type name to get details.");
      }
      
    });

    it('get: get existing doc type', async () => {
  
      mockRepo.mockResult = Promise.resolve(testDocType1);
      const docTypeService = new DocTypeService(mockRepo);
      let request = {
        id: "Deed Initial"
      }
      const result = await docTypeService.get(request);
      expect(result).to.deep.equal(testDocType1);
  
    });

    it('update: updating an existing doc type', async () => {
    
      mockRepo.mockResult = Promise.resolve(testDocType2);
      const docTypeService = new DocTypeService(mockRepo);
      const result = await docTypeService.update('W-2', updateTestPayload );
      expect(result).to.deep.equal(testDocType2Updated);
    });


    it('list: list all doctypes', async () => {
        mockRepo.mockResultList = Promise.resolve(docTypeList);
        const docTypeService = new DocTypeService(mockRepo);
        const result = await docTypeService.list();
        expect(result).to.deep.equal(docTypeList);
    });

});