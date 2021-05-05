import { GroupItem, GroupItemKey } from "../models/groups";

const GroupItem = require('./../models/groups');

export interface GroupsRepositoryInterface 
{
    list: () => Promise<GroupItem []>;
    get: (grpKey: GroupItemKey) => Promise<GroupItem>;
    create: (grpItem : GroupItem) => Promise<GroupItem>;
    update: (grpKey : GroupItemKey, Payload : any) => Promise<GroupItem>;
}