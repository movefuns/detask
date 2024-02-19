
export interface DeTaskList {
    id: {
        id: string;
    };
    nid: string;
    deName: string;
    inscription: string;
    describe: string;
    email: string;
    ext: string;
    tst: string,
    reward: string,
    tcount: number,
    left_tcount: number,
    creator: string;
    taker_addresses: string[];
    st_timestamp_ms: string,
    ed_timestamp_ms: string,
    baglist:any,
    taker_list: any,
}

export interface MoveList {
    id: {
        id: string;
    };
    acc: string;
    amount: string;
    attach_coin: string;
    tick: string;
    type:string;
}

export interface MyCard {
    id: {
        id: string;
    };
    at: string;
    nid: string;
    hp: string;
    mp: string;
    st: string;
    type:string;
}

export interface AdminCap {
    id: {
        id: string;
    };
    type: string;
}

export interface DetaskCreateCap {
    id: {
        id: string;
    };
    taskid: string;
}

export interface DetaskNFT {
    id: {
        id: string;
    };
    tokenId: string;
}

export interface ComponentAProps {
    nowTasklist: any;
    setTasklist: any;
    stringArrayDC: any;
    currentlang:any;
}