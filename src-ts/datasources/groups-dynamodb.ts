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

    var grpItem: GroupItem = {'bpPK': '', 'bpSK':'', 'description' : ''};

     logger.debug('repo get params; ' + JSON.stringify(params));
     var item  = await this.dbClient.get(params).promise() ;
     

     if ( ! item.Item ) 
     {
       throw Error('Results not found for group name ' + grpKey['bpSK']);
     }

     grpItem["bpPK"] = item.Item.bpPK;
     grpItem["bpSK"] = item.Item.bpSK;
     grpItem.description = item.Item.description;
     grpItem.cAt  = item.Item.cAt;
     grpItem.cBy = item.Item.cBy;
     grpItem.uAt = item.Item.uAt;
     grpItem.uBy = item.Item.uBy;

     return grpItem;
  }

  
  async list () 
  {
      var params = {
          TableName : tableName,
          KeyConditionExpression : "#baseKey = :bpPK" ,
          ExpressionAttributeNames: { "#baseKey" : "bpPK"},
          ExpressionAttributeValues: { ":bpPK" : 'groups'}
      };
     var res = await this.dbClient.query(params).promise() ;
     return res.Items as any[];
  }

  async update (grpItem: GroupItem) 
  {

      var params = {
          TableName : tableName,
          Key: {
            'bpPK' : grpItem.bpPK,
            'bpSK' : grpItem.bpSK
          },
          UpdateExpression: "set  description = :description, uBy = :updatedBy , uAt = :updatedAt ",
          ExpressionAttributeValues: {
              ":description": grpItem.description,
              ":updatedBy": grpItem.uBy,
              ":updatedAt": grpItem.uAt
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
