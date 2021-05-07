
export interface GroupItemKey {
    'bpPK' : string,
    'bpSK': string,
}

export interface GroupItem extends GroupItemKey {
    description: string,
    cBy?: string,
    uBy?: string,
    cAt?: string,
    uAt?: string
}