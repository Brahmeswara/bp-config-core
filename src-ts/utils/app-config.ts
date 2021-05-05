const Bottle = require('bottlejs');
import {GroupsDynamodbRepo} from '../datasources/groups-dynamodb';
import {GroupsService} from '../core/services/groups-service';
var AWS = require("aws-sdk");



AWS.config.update({ region: "us-east-1" });
var dynamoDB = function () {
   return new AWS.DynamoDB.DocumentClient();
};

var db = new AWS.DynamoDB();

const bottle = new Bottle();
bottle.constant('db', db);
bottle.service('DynamoDB', dynamoDB);
bottle.service('groupsRepository', GroupsDynamodbRepo, 'DynamoDB');
bottle.service('groupsService', GroupsService, 'groupsRepository');

module.exports = bottle.container;