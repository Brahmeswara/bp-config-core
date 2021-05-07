import { DocTypeItem, DocTypeItemKey } from "../models/doctypes";

export interface DocTypeRepositoryInterface 
{
    list: () => Promise<DocTypeItem []>;
    get: (grpKey: DocTypeItemKey) => Promise<DocTypeItem>;
    create: (grpItem : DocTypeItem) => Promise<DocTypeItem>;
    update: (grpKey : DocTypeItem) => Promise<DocTypeItem>;
}