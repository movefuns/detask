#[test_only]
module detaskmv::detaskmv_test{
    use std::debug::{Self,print};
    use std::string::{Self,utf8,String};
    #[test]
    fun test_detask(){
        print(&utf8(b"module:detaskmv: test"));
    }
}