import {DocTypeItemKey, DocTypeItem} from "../core/models/doctypes";
import {DynamoDB} from 'aws-sdk';
import {DocumentClient} from 'aws-sdk/clients/dynamodb';
import {DocTypeRepositoryInterface} from '../core/respository/doctypes-repo';
const {Logger} = require('@docudata/common-utils');
const logger = new Logger('DocTypeDynamoDBRepo: ');

const tableName = process.env.DOCUDATA_BASE_PLATFORM_TABLE || 'testtable';

export class DocTypeDynamodbRepo implements DocTypeRepositoryInterface {

    private dbClient: DynamoDB.DocumentClient;
  
    constructor(private dynamoDB: DynamoDB.DocumentClient) {
      if (!tableName) {
        throw Error('DOCUDATA_BASE_PLATFORM_TABLE is not defined');
      }
      this.dbClient = dynamoDB;
    }

    async create (docTypeItem : DocTypeItem) 
    {
        var params: DocumentClient.PutItemInput = {
            TableName : tableName,
            Item: docTypeItem
        };
  
        logger.debug('create Params: ' + JSON.stringify(params));
  
        var item = await this.dbClient.put(params).promise();
        return docTypeItem;        
    }

    async get (docTypeKey: DocTypeItemKey) 
    {
        var params = {
            TableName : tableName,
            Key: docTypeKey
        };
  
      var docTypeItem: DocTypeItem = {'bpPK': '', 'bpSK':'', 'description' : ''};
  
       logger.debug('repo get params; ' + JSON.stringify(params));
       var item  = await this.dbClient.get(params).promise() ;
       
       if ( ! item.Item ) 
       {
         throw Error('Results not found for group name ' + docTypeKey['bpSK']);
       }
  
       docTypeItem.bpPK = item.Item.bpPK;
       docTypeItem.bpSK = item.Item.bpSK;
       docTypeItem.description = item.Item.description;
       docTypeItem.grp = item.Item.grp,
       docTypeItem.cAt  = item.Item.cAt;
       docTypeItem.cBy = item.Item.cBy;
       docTypeItem.uAt = item.Item.uAt;
       docTypeItem.uBy = item.Item.uBy;
  
       return docTypeItem;
    }

  
    async list () 
    {
        var params = {
            TableName : tableName,
            KeyConditionExpression : "#baseKey = :bpPK" ,
            ExpressionAttributeNames: { "#baseKey" : "bpPK"},
            ExpressionAttributeValues: { ":bpPK" : 'doctypes'}
        };
       var res = await this.dbClient.query(params).promise() ;
       return res.Items as any[];
    }

    async update (docTypeItem: DocTypeItem) 
    {
        var params = {
            TableName : tableName,
            Key: {
              'bpPK' : docTypeItem.bpPK,
              'bpSK' : docTypeItem.bpSK
            },
            UpdateExpression: "set  description = :description, uBy = :updatedBy , uAt = :updatedAt ",
            ExpressionAttributeValues: {
                ":description": docTypeItem.description,
                ":updatedBy": docTypeItem.uBy,
                ":updatedAt": docTypeItem.uAt
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