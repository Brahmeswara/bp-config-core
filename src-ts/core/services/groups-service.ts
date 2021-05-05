import {GroupsRepositoryInterface} from '../respository/groups-repo';
import { GroupItem, GroupItemKey } from "../models/groups";
const {Logger} = require('@docudata/common-utils');

const logger = new Logger('GroupsService');
logger.globalLogLevel = 'DEBUG';

export class GroupsService {

    repository : GroupsRepositoryInterface ;

    constructor (groupsRepo : GroupsRepositoryInterface)
    {
        this.repository = groupsRepo;
    }

    async list ()
    {
        //console.log('from groupsService.list');
        return await this.repository.list();
    }

    async get (request: any)
    {

        if ( ! request || ! request.id )
            throw new Error('GroupServices: get: provide groupname to get details.')

        var itemKey: GroupItemKey = {
            'base-pk' : 'groups',
            'base-sk' : request.id,
        };

        return await this.repository.get(itemKey);
    }

    async create (request: any) 
    {


        //logger.debug('groupsService: typeof incoming request: '+ typeof request);
        var grpItem: GroupItem = {
          
            'base-pk' : "groups",
            'base-sk' : request.groupName,
            'description' : request.desc,
            'createdBy' : request.userName,
            'createdAt' : new Date().toDateString(),
            'updatedBy' : request.userName,
            'updatedAt' : new Date().toDateString()

        }

        return await this.repository.create(grpItem);
    }

    async update (groupName: string, request: any)
    {
        if ( ! groupName ) 
            throw Error('group name to update is empty and must be passed to update');

        var itemKey: GroupItemKey = {
            'base-pk' : 'groups',
            'base-sk' : groupName
        }

        var payload: any = {
            'description' : request.description,
            'updatedBy'   : request.userName,
            'updatedAt'   : new Date().toDateString()
        }

        return await this.repository.update(itemKey, payload);

    }

}
