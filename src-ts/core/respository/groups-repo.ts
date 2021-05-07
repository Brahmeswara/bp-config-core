import { GroupItem, GroupItemKey } from "../models/groups";

export interface GroupsRepositoryInterface 
{
    list: () => Promise<GroupItem []>;
    get: (grpKey: GroupItemKey) => Promise<GroupItem>;
    create: (grpItem : GroupItem) => Promise<GroupItem>;
    update: (grpKey : GroupItem) => Promise<GroupItem>;
}