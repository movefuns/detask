module detaskmv::denft{
    
    use sui::object::{Self,UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use std::string::utf8;
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::balance::{Self, Balance};

    // The creator bundle: these two packages often go together.
    use sui::package;
    use sui::display;

    const DETASK_LOGO_LIMIT: u64 = 8888;
    const AMOUNT:u64 = 100_000_000;//0.1 sui payment
    const SERVICEDDR :address = @0xd73a6dc9ff5222aed93d45049767837030c74cba9835d8796c7acd311c12e0e2;

    const ERR_NOT_ENOUGH_COIN :u64 = 4000;
    const DETASK_LOGO_IS_FULL:u64 = 4001;


    ///NFT
    struct DetaskNFT has key, store {
        id: UID,
        tokenId: u64,
        amt:u64,
    }

    /// One-Time-Witness for the module.
    struct DENFT has drop {}

    struct State has key {
        id: UID,
        count: u64
    }
    
    #[allow(unused_function)]
    fun init(witness: DENFT, ctx:&mut TxContext){
        let keys = vector[
            utf8(b"name"),
            utf8(b"image_url"),
            utf8(b"description"),
            utf8(b"project_url"),
        ];

        let values = vector[
            utf8(b"DeTask #{tokenId}"),
            utf8(b"https://detask.etboodonline.com/logo/detasklogo.jpg"),
            utf8(b"DeTask's Commemorative NFT"),
            utf8(b"https://detask.etboodonline.com"),
        ];

        let publisher = package::claim(witness,ctx);
        
        let display = display::new_with_fields<DetaskNFT>(&publisher, keys, values, ctx);
        display::update_version(&mut display);
        transfer::public_transfer(publisher, tx_context::sender(ctx));
        transfer::public_transfer(display, tx_context::sender(ctx));

        transfer::share_object(State{
            id: object::new(ctx),
            count: 0
        });
   
    }

    #[lint_allow(self_transfer)]
    entry public fun mint( 
        payment: &mut Coin<SUI>,
        state:&mut State, 
        ctx: &mut TxContext){
        assert!(state.count < DETASK_LOGO_LIMIT, DETASK_LOGO_IS_FULL);//pay to create
        assert!(coin::value(payment) >= AMOUNT, ERR_NOT_ENOUGH_COIN);//pay to create
        
        let coin_balance = coin::balance_mut(payment);
        let paid_coin = balance::split(coin_balance, AMOUNT);
        transfer::public_transfer(coin::from_balance<SUI>(paid_coin, ctx), SERVICEDDR);

        let sender = tx_context::sender(ctx);
        state.count = state.count + 1;
        let nft = DetaskNFT {
            id: object::new(ctx),
            tokenId: state.count,
            amt:AMOUNT,
        };
        transfer::public_transfer(nft, sender);
    }

}