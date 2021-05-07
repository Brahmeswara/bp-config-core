import {DocTypeRepositoryInterface} from '../respository/doctypes-repo';
import {DocTypeItem, DocTypeItemKey } from "../models/doctypes";
const {Logger} = require('@docudata/common-utils');

const logger = new Logger('DocTypeService');
logger.globalLogLevel = 'DEBUG';

export class DocTypeService {

    repository : DocTypeRepositoryInterface ;

    constructor (repo : DocTypeRepositoryInterface)
    {
        this.repository = repo;
    }

    async create (request: any) 
    {
        //logger.debug('groupsService: typeof incoming request: '+ typeof request);
        var docTypeItem: DocTypeItem = {
          
            'bpPK' : "doctypes",
            'bpSK' : request.docTypeName,
            'description' : request.description,
            'grp' : request.groupName,
            'cBy' : request.userName,
            'cAt' : new Date().toDateString(),
            'uBy' : request.userName,
            'uAt' : new Date().toDateString()

        }

        return await this.repository.create(docTypeItem);
    }

    /* get a given doument type by name */
    async get (request: any)
    {
        if ( ! request || ! request.id )
            throw new Error('DocTypeServices: get: provide doc type name to get details.')

        var itemKey: DocTypeItemKey = {
            'bpPK' : 'doctypes',
            'bpSK' : request.id,
        };

        return await this.repository.get(itemKey);
    }

    async update (docTypeName: string, request: any)
    {
        if ( ! docTypeName ) 
            throw Error('docType name to update is empty and must be passed to update');

        var item: DocTypeItem = {
            'bpPK' : 'doctypes',
            'bpSK' : docTypeName,
            'description' : request.description,
            'grp' : request.grp,
            'uBy' : request.userName,
            'uAt' : new Date().toDateString()
        }
        return await this.repository.update(item);
    }


    /* return doctypes list */
    async list ()
    {
        return await this.repository.list();
    }

}