
export interface GroupItemKey {
    'base-pk' : string,
    'base-sk': string,
}

export interface GroupItem extends GroupItemKey {
    description: string,
    createdBy?: string,
    updatedBy?: string,
    createdAt?: string,
    updatedAt?: string
}