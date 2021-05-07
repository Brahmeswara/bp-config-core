export interface DocTypeItemKey {
    'bpPK' : string,
    'bpSK': string
}

export interface DocTypeItem extends DocTypeItemKey {
    description?: string,
    grp?: string,
    cBy?: string,
    uBy?: string,
    cAt?: string,
    uAt?: string
}