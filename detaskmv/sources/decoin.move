#[allow(unused_use)]

module detaskmv::decoin{
    use std::option;
    use sui::tx_context::{Self, TxContext,sender};
    use sui::balance::{Self, Balance};
    use sui::coin::{Self, Coin,TreasuryCap};
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::sui::SUI;    
    use sui::event;
    
    use std::debug::{Self,print};
    use std::string::{Self,utf8,String};

        /// Event marking when a transcript has been requested
    struct TranscriptRequestEvent has copy, drop {
        // The Object ID of the transcript wrapper
        wrapper_id: u64,
        // The intended address of the transcript
        intended_address: address,
    }

    struct DECOIN has drop {}

    const GAMEADDR: address = @0xd73a6dc9ff5222aed93d45049767837030c74cba9835d8796c7acd311c12e0e2;
    const ERRNOT_ENOUGH_COIN: u64 = 2004;
    const SUITOMY_COIN: u64 = 10;

    #[allow(unused_function)]
    fun init(witness:DECOIN,ctx:&mut TxContext){
        let (treasury, metadata) = 
            coin::create_currency(witness, 9, b"DetaskCoin", b"DetaskCoin", b"Detask Coins", option::none(), ctx);
        
        transfer::public_freeze_object(metadata);
        transfer::public_transfer(treasury, tx_context::sender(ctx))
    }

    public entry fun init_coin(ctx: &mut TxContext) {
        // assert!(!flag::exists_coin<GCOIN>(flag, object::id_from_address(sender(ctx))), ErrCoin_Exist);
        let zero_coin = coin::zero<DECOIN>(ctx);
        // let coin_id = object::id(&zero_coin);
        transfer::public_transfer(zero_coin, sender(ctx));
        // flag::add<GCOIN>(flag, object::id_from_address(sender(ctx)));
        // let record_id = record::create(ctx);
        // event::emit(Returned { coin_id, record_id })
    }

    public entry fun buy_coin(coin: &mut Coin<DECOIN>,
                              payment: &mut Coin<SUI>,
                              amount: u64,
                              cap: &mut TreasuryCap<DECOIN>,
                              ctx: &mut TxContext) {
        assert!(coin::value(payment) >= amount, ERRNOT_ENOUGH_COIN);
        let coin_balance = coin::balance_mut(payment);
        let paid_coin = balance::split(coin_balance, amount);
        transfer::public_transfer(coin::from_balance<SUI>(paid_coin, ctx), GAMEADDR);
        coin::join(coin, coin::mint(cap, amount * SUITOMY_COIN, ctx));
    }


    #[test_only]
    
    use sui::test_scenario;
    
    #[allow(unused_mut_ref)]
    public fun init_for_testing(ctx: &mut TxContext) {
        std::debug::print<String>(&utf8(b"star test init_for_testing"));
        // let noc = MYCOIND{};
        // init(noc,ctx);

        let _ = ctx;

        std::debug::print<String>(&utf8(b"star test init_for_testing end"));
    }

    public entry fun transfer_to_other(user:u64,nowCoin:Coin<DECOIN>,to:address){
        event::emit(
            TranscriptRequestEvent{
                wrapper_id:user,
                intended_address:to
            }
        );
        transfer::public_transfer(nowCoin,to);
    }


    #[test]
    #[allow(unused_function)]
    fun test_pay_suicoin(){
        std::debug::print<String>(&utf8(b"star test mycoind"));
        let toAddress:address = @0xAABBCC;
        let looker:address = @0xBBBBCC;
        let scenario:sui::test_scenario::Scenario = test_scenario::begin(looker);
        let nowctx : &mut TxContext = test_scenario::ctx(&mut scenario );
        init_for_testing(nowctx);
        let curCoin = coin::zero<DECOIN>(nowctx);
        let curCoinNew = coin::mint_for_testing<DECOIN>(100,nowctx);
        //std::debug::print<Coin<SUI>>(&curCoinNew);
        // let curCoin2 = Coin{
        //     id:object::new(nowctx),
        //     balance:Balance<MyCoin>{value:1000}
        //     };
         transfer_to_other(1,curCoin,toAddress);
         transfer_to_other(2,curCoinNew,toAddress);
        std::debug::print<String>(&utf8(b"star test mycoind end..."));
        
        test_scenario::end(scenario);
    }
}