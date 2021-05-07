//const {GroupItemKey, GroupItem} = require('./core/models/groups');
const {GroupsService} = require('./core/services/groups-service') ;
const {GroupsRepositoryInterface} = require('./core/respository/groups-repo');
const {GroupsDynamodbRepo} = require('./datasources/groups-dynamodb');
const {DocTypeService} = require('./core/services/doctype-services');
const {DocTypeRepositoryInterface} = require('./core/respository/doctypes-repo');
const {DocTypeDynamodbRepo} = require('./datasources/doctype-dynamodb');

export {GroupsRepositoryInterface,  GroupsDynamodbRepo, GroupsService, 
        DocTypeRepositoryInterface, DocTypeDynamodbRepo,  DocTypeService};