import {GroupsService} from './groups-service' ;

import * as assert from "assert";
import {expect} from "chai";
import {fail} from "assert";
import {GroupItemKey, GroupItem} from './../models/groups';
import {GroupsRepositoryInterface } from '../respository/groups-repo'

const testGrp: GroupItem = {
    'base-pk' : "groups",
    'base-sk': 'Closing',
    description: 'Closing process related documents',
    createdBy: 'brahmeswara@yahoo.com',
    updatedBy: 'brahmeswara@yahoo.com',
    createdAt:  new Date().toDateString(),
    updatedAt: new Date().toDateString()
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

const testGrpKey: GroupItemKey = {
  'base-pk' : "groups",
  'base-sk': 'Closing'
};

const testGrpKey2: GroupItemKey = {
  'base-pk' : "groups",
  'base-sk': 'Mortgage'
};

var updateTestPayload: any = {
  'description' : 'updated desc..',
  'updatedBy'   : 'brahmeswara@yahoo.com',
  'updatedAt'   : new Date().toDateString(),
  'userName'    : 'brahmeswara@yahoo.com'
};

const testGrp2Updated: GroupItem = {
  'base-pk' : testGrp2['base-pk'],
  'base-sk': testGrp2['base-sk'],
  'description' : updateTestPayload.description,
  'updatedBy'   : updateTestPayload.userName,
  'updatedAt'   : updateTestPayload.updatedAt,
  'createdAt'   : testGrp2.createdAt,
  'createdBy'   : testGrp2.createdBy
};

const grpList: GroupItem[] = [testGrp, testGrp2] ;


class MockRepo implements GroupsRepositoryInterface {
  mockResult?: Promise<GroupItem>;
  mockResultList? : Promise<GroupItem[]>

  create (params: any) {
    assert.ok(this.mockResult);
    //expect(params.TableName).to.equal('test-table');
    //expect(params).to.deep.equal(testGrp);
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

  async update (grpKey: GroupItemKey, payload: any)
  {
    assert.ok(this.mockResult);
    expect(grpKey).to.deep.equal(testGrpKey2);
    const updatedItem: GroupItem = testGrp2;
    updatedItem.description = payload.description;
    updatedItem.updatedAt = payload.updatedAt;
    updatedItem.updatedBy = payload.updatedBy;

    return updatedItem;
  }
}

describe('GroupsService', () => {
  const mockRepo = new MockRepo();

  it('create: new record 1', async () => {
    mockRepo.mockResult = Promise.resolve(testGrp);
    const grpService = new GroupsService(mockRepo);

    const request = {
      groupName: 'Closing',
      desc: 'Closing process related documents',
      userName: 'brahmeswara@yahoo.com'
    }
    const result = await grpService.create(request);
    expect(result).to.deep.equal(testGrp);
  });

  it('create: new record 2', async () => {
    mockRepo.mockResult = Promise.resolve(testGrp2);
    const grpService = new GroupsService(mockRepo);

    const request = {
      groupName: 'Mortgage',
      desc: 'Mortgage process related documents',
      userName: 'brahmeswara@yahoo.com'
    }
    const result = await grpService.create(request);
    expect(result).to.deep.equal(testGrp2);
  });


  it('get: calling get with no key passed', async () => {
    mockRepo.mockResult = Promise.resolve(testGrp);
    const grpService = new GroupsService(mockRepo);
    try  {
    const result = await grpService.get(null);

    } catch (err)
    {
      expect(err.toString()).to.equal("Error: GroupServices: get: provide groupname to get details.");
    }
    
  });

  
  it('get: calling get with known key', async () => {
  
    mockRepo.mockResult = Promise.resolve(testGrp);
    const grpService = new GroupsService(mockRepo);
    let request = {
      id: "Closing"
    }
    const result = await grpService.get(request);
    expect(result).to.deep.equal(testGrp);

  });

  it('update: updating an existing record', async () => {
    
    mockRepo.mockResult = Promise.resolve(testGrp2);
    const grpService = new GroupsService(mockRepo);
    const result = await grpService.update('Mortgage', updateTestPayload );
    expect(result).to.deep.equal(testGrp2Updated);
  });

  it('list: list all records', async () => {
    mockRepo.mockResultList = Promise.resolve(grpList);
    const grpService = new GroupsService(mockRepo);
    const result = await grpService.list();
    expect(result).to.deep.equal(grpList);
  });

});