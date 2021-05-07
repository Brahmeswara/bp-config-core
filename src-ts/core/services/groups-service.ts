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
            'bpPK' : 'groups',
            'bpSK' : request.id,
        };

        return await this.repository.get(itemKey);
    }

    async create (request: any) 
    {


        //logger.debug('groupsService: typeof incoming request: '+ typeof request);
        var grpItem: GroupItem = {
          
            'bpPK' : "groups",
            'bpSK' : request.groupName,
            'description' : request.description,
            'cBy' : request.userName,
            'cAt' : new Date().toDateString(),
            'uBy' : request.userName,
            'uAt' : new Date().toDateString()

        }

        return await this.repository.create(grpItem);
    }

    async update (groupName: string, request: any)
    {
        if ( ! groupName ) 
            throw Error('group name to update is empty and must be passed to update');

        var item: GroupItem = {
            'bpPK' : 'groups',
            'bpSK' : groupName,
            'description' : request.description,
            'uBy' : request.userName,
            'uAt' : new Date().toDateString()
        }

        return await this.repository.update(item);
    }

}
