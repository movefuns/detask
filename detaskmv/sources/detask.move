#[allow(unused_use)]

module detaskmv::detaskmv{
    use std::vector;
    use sui::event;
    use sui::object::{Self,UID,ID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use std::string::{Self,utf8,String};
    use std::ascii::{Self, String as TString};
    use sui::clock::{Self, Clock};
    use sui::table;
    use sui::balance::{Self, Balance};
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::bag::{Self,Bag};
    use std::type_name;
    use sui::dynamic_object_field as ofield;
    use sui::dynamic_field as field;

    use detaskmv::decoin::DECOIN;

    const VERSION:u64 = 0;//current package version
    const AMOUNT:u64 = 100_000_000;//0.1  sui
    const AMOUNT2:u64 = 30_000_000;//0.03 sui
    const SERVICEDDR :address = @0xd73a6dc9ff5222aed93d45049767837030c74cba9835d8796c7acd311c12e0e2;

    const ERR_NOT_ENOUGH_COIN :u64 = 4000;
    const ERR_NOT_ENOUGH_TCOUNT :u64 = 4001;
    const ERR_HASALREADYTAKED :u64 = 4002;
    const ERR_HASALREADYREWARD :u64 = 4003;
    const ERR_TASKID_WASERR :u64 = 4004;
    const EFieldAlreadyExists:u64 = 4005;
    const EFieldNotRegister:u64 = 4006;
    const ERR_NOT_CURRENT_TASK :u64 = 4007;
    const ENotOwner :u64 = 4008;
    const ErrorNotRealTaker :u64 = 4009;

    const ST_OPEN    :u64 = 1;
    const ST_CLOSE   :u64 = 2;
    const ST_SLEEP   :u64 = 3;
    const ST_END     :u64 = 4;

    const TASK_TYPE  :u64 = 1;
    const TASK_TYPE1  :u64 = 2;
    const BAG_TPYE  : vector<u8> = b"TUSEBAG";
    const MOVEQ:u64    = 4;
    const COUPON:u64   = 5;
    const NORMAL:u64   = 6;
    const MOVEX:u64    = 7;
    const MOVEB:u64    = 8;
    const MOVEA:u64    = 9;
    const FIND:u64     = 10;
    const IDO:u64      = 11;


    struct DetaskAdminCap has key,store{
        id:UID, //object id
    }

    //typelist manager cap
    struct BagCountCap has key,store{
        id:UID, //object id
        count:u64,
        fee:u64,
        bagstatus : table::Table<u64,BagStatus>,//bags,types
        bagindex : table::Table<String,u64>,//name ,index
        namelist: vector<String>,
    }

    //typelist manager items
    struct BagStatus has store{
        bagname:String,//name
        bagtypename:String,//type
        bagstatus:u64,//status
        
    }

    //task manager
    struct DetaskManagerCap has key,store{
        id:UID, //object id
        count:u64,
        fee:u64,
        fee2:u64,
        tbtask : table::Table<u64,ID>,//id,ID
        // tbtaskExt : table::Table<u64,DetaskBagExt>,//id,types
    }

    struct Detask has key,store{
        id:UID, //object id
        nid:ID,//Task Number 
        deName:String,//Task Name
        inscription:String,//inscription Name
        describe:String,
        email:String,
        ext:String,
        img:String,
        reward:u64,
        tst:u64,
        tcount:u64,//total task number
        left_tcount:u64,//left task number
        creator:address,//publisher
        taker_addresses: vector<address>,//take task
        taker_list: table::Table<address,ListingLog>,//task log
        ttype:u64,// add task type / ext task
        baglist:Bag, // add a bag for listing / packet 
        mslist:vector<ID>,//backup id
        st_timestamp_ms: u64,
        ed_timestamp_ms: u64,

    }
    struct DetaskCreatorCap has key,store{
        id:UID, //object id
        taskid:ID
    }
    //*

    struct ListingLog has key,store{
        id:UID,
        taskid:ID,
        user:address,
        tst:u64,
        logs:String,
    }
    //add task ext start
    struct Listing has key,store{
        id:UID,
        taskid:ID,
        owner:address,
    }

    // struct DetaskBagExt has key,store{
    //     id:UID,
    //     tid:ID,// task id
    //     ttype:u64,// add task type / ext task
    //     baglist:Bag,
    //     mslist:vector<ID>,
    // }
    // */
    // list move into task & delist move outto task
    // 
    //add task ext end

    struct UserTask has key,store{
        id:UID,
        taskid:ID,
        user:address,
        inscription:String,
        tst:u64,
    }

    // struct UserTaskLog has key,store{
    //     id:UID,
    //     taskid:u64,
    //     user:address,
    // }

    // --------------- Events ---------------
    struct NewDetask has copy, drop {
        id: ID,
        sender: address,
        tcount: u64,
        task_type: u64,
    }

    struct NewDetaskExt has copy, drop {
        id: ID,
        task_type: u64,
    }

    struct NewTaketask has copy, drop {
        id: ID,
        sender: address,
        tcount: u64,
        task_type: u64,
    }

    struct NewBagTypeEv has copy, drop {
        id: ID,
        bagname:String,//name
        bagtypename:String,//type
        tcount: u64,
    }

    struct NewBagCountCapEv has copy, drop {
        id: ID,
    }

    struct NewDetaskManagerCapEv has copy, drop {
        id: ID,
    }

    //otw
    struct DETASKMV has drop{} 

    #[allow(unused_function)]
    fun init(otw:DETASKMV,ctx:&mut TxContext){
        let admin = tx_context::sender(ctx);
        let nowDetask = DetaskAdminCap{
            id:object::new(ctx),
        };
        transfer::transfer(nowDetask,admin);

        let id = object::new(ctx);
        let eid = object::uid_to_inner(&id);
        let nowCount = BagCountCap{
            id,
            count:0,
            fee:AMOUNT,
            bagstatus: table::new(ctx),
            bagindex: table::new(ctx),
            namelist: vector::empty(),
        };
        transfer::public_share_object(nowCount);

        event::emit(NewBagCountCapEv{
            id:eid,
        });

        let mid = object::new(ctx);
        let emid = object::uid_to_inner(&mid) ;
        let nowDetaskManager = DetaskManagerCap{
            id:mid,
            count:0,
            fee:AMOUNT,
            fee2:AMOUNT2,
            tbtask:table::new(ctx)
        };
        transfer::public_share_object(nowDetaskManager);

        event::emit(NewDetaskManagerCapEv{
            id:emid,
        });
    }

    //entry create task
    entry public fun createtask(
        payment: &mut Coin<SUI>,
        cap:&mut DetaskManagerCap,
        deName:String,
        inscription:String,//inscription Name
        describe:String,
        email:String,
        ext:String,
        img:String,
        reward:u64,
        tcount:u64,//total task number
        sttime:u64,
        edtime:u64,
        ttype:u64,
        ctx:&mut TxContext
    ){
        assert!(coin::value(payment) >= AMOUNT, ERR_NOT_ENOUGH_COIN);//pay to create
        let coin_balance = coin::balance_mut(payment);
        let paid_coin = balance::split(coin_balance, AMOUNT);
        transfer::public_transfer(coin::from_balance<SUI>(paid_coin, ctx), SERVICEDDR);

        let creator = tx_context::sender(ctx);//publisher

        let id = object::new(ctx);
        let taskid = object::uid_to_inner(&id);
        event::emit(NewDetask{
            id:taskid,
            sender:creator,
            tcount,
            task_type: ttype,
        });

        let newTask = Detask{
            id,
            nid:taskid,
            deName,
            inscription,
            describe,
            email,
            ext,
            img,
            tst:ST_OPEN,
            reward,
            tcount,
            left_tcount:tcount,
            creator,
            taker_addresses:vector::empty<address>(),
            taker_list: table::new(ctx),
            st_timestamp_ms:sttime,
            ed_timestamp_ms:edtime,
            ttype,
            baglist:bag::new(ctx),
            mslist:vector::empty()
        };
        transfer::share_object(newTask);

        table::add(&mut cap.tbtask,cap.count,taskid);
        cap.count = cap.count + 1;


        let detaskCreatorCap = DetaskCreatorCap{
            id:object::new(ctx),
            taskid
        };
        transfer::transfer(detaskCreatorCap,creator);

    }

    public entry fun putintobag<T: key + store>(
        item: T,
        cap : &BagCountCap,
        dcap: &DetaskCreatorCap,
        dbag:&mut  Detask,
        ctx: &mut TxContext
    ) {
        let tpname = type_name::get<T>();
        let fullname = *type_name::borrow_string(&tpname);
        // assert!( vector::contains(&cap.namelist,&string::from_ascii(fullname)) , EFieldNotRegister);
        assert!( table::contains(&cap.bagindex,string::from_ascii(fullname)), EFieldNotRegister);
        assert!( dcap.taskid== dbag.nid,ERR_NOT_CURRENT_TASK);

        let creator = tx_context::sender(ctx);//publisher

        let item_id = object::id(&item);
        let listing = Listing {
            id: object::new(ctx),
            taskid: dbag.nid,
            owner:creator,
        };

        ofield::add(&mut listing.id, true, item);
        bag::add(&mut dbag.baglist, item_id, listing);
    }


    fun delist<T: key + store>(
        dbag:&mut  Detask,
        item_id: ID,
        ctx: &mut TxContext
    ): T {
        let Listing {
            id,
            taskid: _,
            owner,
        } = bag::remove(&mut dbag.baglist, item_id);

        assert!(tx_context::sender(ctx) == owner, ENotOwner);

        let item = ofield::remove(&mut id, true);
        object::delete(id);
        item
    }

    public entry fun backtoSender<T: key + store>(
        item_id: ID,
        dcap: &DetaskCreatorCap,
        cap : &BagCountCap,
        dbag:&mut  Detask,
        ctx: &mut TxContext
    ) {
        let tpname = type_name::get<T>();
        let fullname = *type_name::borrow_string(&tpname);
        assert!( table::contains(&cap.bagindex,string::from_ascii(fullname)) , EFieldNotRegister);
        assert!( dcap.taskid== dbag.nid,ERR_NOT_CURRENT_TASK);

        let item = delist<T>(
            dbag,
            item_id,
            ctx);
        transfer::public_transfer(item, tx_context::sender(ctx));
    }

    //send reward 
    public entry fun sendtouser<T: key + store>(
        payment: &mut Coin<SUI>,
        item_id: ID,
        dcap: &DetaskCreatorCap,
        cap : &BagCountCap,
        dbag:&mut  Detask,
        user:address,
        ctx: &mut TxContext
    ) {
        let tpname = type_name::get<T>();
        let fullname = *type_name::borrow_string(&tpname);
        assert!( table::contains(&cap.bagindex,string::from_ascii(fullname)) , EFieldNotRegister);
        assert!( dcap.taskid== dbag.nid,ERR_NOT_CURRENT_TASK);
        assert!( table::contains(&dbag.taker_list,user) , ErrorNotRealTaker);
        assert!(coin::value(payment) >= AMOUNT2, ERR_NOT_ENOUGH_COIN);//pay to create

        let coin_balance = coin::balance_mut(payment);
        let paid_coin = balance::split(coin_balance, AMOUNT2);
        transfer::public_transfer(coin::from_balance<SUI>(paid_coin, ctx), SERVICEDDR);

        let item = delist<T>(
            dbag,
            item_id,
            ctx);
        transfer::public_transfer(item, user);
        
        let nowUserListing = table::borrow_mut(&mut dbag.taker_list,user);
        nowUserListing.tst= ST_END;
    }

    //change task
    entry public fun changeDetask(
        _:&DetaskAdminCap,
        detask:&mut Detask,
        tst:u64,
        _:&mut TxContext
    ){
        detask.tst = tst;
    }
    entry public fun changeUsertask(
        _:&DetaskAdminCap,
        uertask:&mut UserTask,
        tst:u64,
        _:&mut TxContext
    ){
        uertask.tst = tst;
    }

    // public entry fun registerFromItem<T: key + store >(
    //     _: T, //&T unavailable
    //     _:&DetaskAdminCap,
    //     cap :&mut BagCountCap,
    //     dbag:&mut  Detask,
    //     ctx: &mut TxContext
    // ){
    //     let tpname = type_name::get<T>();
    //     let fullname = *type_name::borrow_string(&tpname);
    //     let nowSting = string::from_ascii(fullname);
        
    //     vector::push_back(&mut cap.namelist,nowSting);

    //     // let creator = tx_context::sender(ctx);//publisher

    //     // let item_id = object::id(&item);
    //     // let listing = Listing {
    //     //     id: object::new(ctx),
    //     //     taskid: dbag.nid,
    //     //     owner:creator,
    //     // };

    //     // ofield::add(&mut listing.id, true, item);
    //     // bag::add(&mut dbag.baglist, item_id, listing);
    // }


    entry public fun registerBagtype(
        _:&DetaskAdminCap,
        cap:&mut BagCountCap,
        bagname:String,//name
        bagtypename:String,//type
        bagstatus:u64,//status
        _:&mut TxContext
    ){
        assert!( table::contains(&cap.bagindex,bagtypename) == false , EFieldAlreadyExists);

        //name k : number v
        table::add(&mut cap.bagindex,
            bagtypename,cap.count
        );

        //k index  : v bagstatus
        table::add(&mut cap.bagstatus,
            cap.count,
            BagStatus{
                bagname,
                bagtypename,
                bagstatus
        });

        event::emit(NewBagTypeEv{
            id : object::uid_to_inner(&cap.id),
            bagname,//name
            bagtypename,//type
            tcount: cap.count,
        });
        
        cap.count = cap.count + 1;
    }


    //user take task
    entry public fun usertaketask(
        task:&mut Detask,
        ctx:&mut TxContext
    ){
        let user = tx_context::sender(ctx);//publisher

        assert!(!vector::contains(&task.taker_addresses, &user), ERR_HASALREADYTAKED);
        assert!(task.left_tcount > 0, ERR_NOT_ENOUGH_TCOUNT);//if now left tcount == tcount
        
        let id = object::new(ctx);
        // let eid = object::uid_to_inner(&id);
        
        task.left_tcount = task.left_tcount - 1;
        // event::emit(NewTaketask{
        //     id:eid,
        //     sender:user,
        //     tcount:task.left_tcount,
        //     task_type: TASK_TYPE,
        // });

        vector::push_back(&mut task.taker_addresses,user);

        table::add(&mut task.taker_list,user,ListingLog{
            id,
            taskid:task.nid,
            user,
            tst:ST_OPEN,
            logs:task.inscription,
        });

    }

    //reward sui
    entry public fun sendRewardtoTaker(
        cap:&DetaskCreatorCap,
        task:&mut Detask,
        user:address,
        payment: &mut Coin<SUI>,
        ctx:&mut TxContext
    ){

        assert!(coin::value(payment) >= task.reward, ERR_NOT_ENOUGH_COIN);//pay to create
        assert!( table::contains(&task.taker_list,user) , ErrorNotRealTaker);

        let nowUserListing = table::borrow_mut(&mut task.taker_list,user);
        assert!(nowUserListing.tst == ST_OPEN, ERR_HASALREADYREWARD);//
        assert!(nowUserListing.taskid == cap.taskid, ERR_TASKID_WASERR);//

        nowUserListing.tst= ST_END;

        let coin_balance = coin::balance_mut(payment);
        let paid_coin = balance::split(coin_balance, task.reward);
        transfer::public_transfer(coin::from_balance<SUI>(paid_coin, ctx), user);

    }

    //get red packet $move
    // entry public fun getRedMovePack(

    // ){

    // }


    #[test_only]
    use sui::test_scenario;
    use std::debug::{Self,print};
    use std::ascii::string;

    #[test]
    fun test_type(){
         let tpname = type_name::get<u64>();
         let fullname = type_name::borrow_string(&tpname);
        
        let tpname2 = type_name::get<u64>();
        if(type_name::into_string(tpname2) == string(b"0000000000000000000000000000000000000000000000000000000000000001::string::String")){
            print(&utf8(b"ok"));
        }else{
            print(&utf8(b"no ok"));
        };

        print(fullname);

        
    }

}