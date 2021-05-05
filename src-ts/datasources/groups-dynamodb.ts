

import {GroupItemKey, GroupItem} from "../core/models/groups";
import {DynamoDB} from 'aws-sdk';
import {DocumentClient} from 'aws-sdk/clients/dynamodb';
import {GroupsRepositoryInterface} from '../core/respository/groups-repo';
const {Logger} = require('@docudata/common-utils');
const logger = new Logger('GroupsDynamoDBRepo: ');

const tableName = process.env.DOCUDATA_BASE_PLATFORM_TABLE || 'testtable';

/**
 * External interface to storage of "GroupItem".
 * No business logic here - just deals with external service.
 * This implementation uses DynamoDB.
 */
export class GroupsDynamodbRepo implements GroupsRepositoryInterface {

  private dbClient: DynamoDB.DocumentClient;

  constructor(private dynamoDB: DynamoDB.DocumentClient) {
    if (!tableName) {
      throw Error('DOCUDATA_BASE_PLATFORM_TABLE is not defined');
    }
    this.dbClient = dynamoDB;
  }

  async create (grpItem : GroupItem) 
  {

      var params: DocumentClient.PutItemInput = {
          TableName : tableName,
          Item: grpItem
      };

      logger.debug('create Params: ' + JSON.stringify(params));

      var item = await this.dbClient.put(params).promise();
      return grpItem;        

  }

  async get (grpKey: GroupItemKey) 
  {
      var params = {
          TableName : tableName,
          Key: grpKey
      };

    var grpItem: GroupItem = {'base-pk': '', 'base-sk':'', 'description' : ''};

     logger.debug('repo get params; ' + JSON.stringify(params));
     var item  = await this.dbClient.get(params).promise() ;
     

     if ( ! item.Item ) 
     {
       throw Error('Results not found for group name ' + grpKey['base-sk']);
     }

     grpItem["base-pk"] = item.Item['base-pk'];
     grpItem["base-sk"] = item.Item['base-sk'];
     grpItem.description = item.Item.description;
     grpItem.createdAt  = item.Item.createdAt;
     grpItem.createdBy = item.Item.createdBy;
     grpItem.updatedAt = item.Item.updatedAt;
     grpItem.updatedBy = item.Item.updatedBy;

     return grpItem;
  }

  
  async list () 
  {
      var params = {
          TableName : tableName,
          KeyConditionExpression : "#baseKey = :basePk" ,
          ExpressionAttributeNames: { "#baseKey" : "base-pk"},
          ExpressionAttributeValues: { ":basePk" : 'groups'}
      };
     var res = await this.dbClient.query(params).promise() ;
     return res.Items as any[];
  }

  async update (grpKey: GroupItemKey, payload: any) 
  {

      var params = {
          TableName : tableName,
          Key: grpKey,
          UpdateExpression: "set  description = :description, updatedBy = :updatedBy , updatedAt = :updatedAt ",
          ExpressionAttributeValues: {
              ":description": payload.description,
              ":updatedBy": payload.updatedBy,
              ":updatedAt": payload.updatedAt
          },
          ReturnValues: "UPDATED_NEW"
      };

      logger.debug('update params: ' + params);
      var data: any = {};
      //var err: any = {};

      data = await this.dbClient.update(params).promise();
      return data;
  }
}
