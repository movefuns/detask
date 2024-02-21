import React, { useState } from 'react';
import {
    TransactionBlock,
    TransactionObjectArgument,
} from "@mysten/sui.js/transactions";
import {
    SUI_CLOCK_OBJECT_ID,
    SUI_DECIMALS,
    SUI_TYPE_ARG,
} from "@mysten/sui.js/utils";

import {
    ConnectModal,
    useCurrentAccount,
    useDisconnectWallet,
    useSignAndExecuteTransactionBlock,
    useSuiClientInfiniteQuery,
    useSuiClientQuery,
  } from "@mysten/dapp-kit";

// import { BigNumber } from 'bignumber.js';
import { enqueueSnackbar } from "notistack";
import './BagRegisterButton.css'


interface Props {
     setBagNow: any; // 根据 useNetworkVariable 的类型进行定义
}

export const BagRegisterButton : React.FC<Props> = ({setBagNow}) => {
    const PACKAGE_ID = localStorage.getItem("packageId") as string;
    const MODULE_NAME = "detaskmv";
    const MODULE_Function_Register = "registerBagtype";
    const BagCountid = localStorage.getItem("BagCountid") as string;
    const DetaskAdminCapid = localStorage.getItem("DetaskAdminCapid") as string;

    const [showDialog, setShowDialog] = useState(false);
    const [bagname, setbagname] = useState('');
    const [bagtypename, setbagtypename] = useState('');
    const [bagstatus, setbagstatus] = useState('1');
    // const [email, setEmail] = useState('');
    // const [ext, setExt] = useState('');
    // const [tcount, setTcount] = useState('');
    // const [reward, setReward] = useState('');

    // const [stTime, setStTime] = useState('');
    // const [edTime, setEdTime] = useState('');

    const handleOpenDialog = () => {
        setBagNow(true);
        setShowDialog(true);
    };

    const handleCloseDialog = () => {
        setBagNow(false);
        setShowDialog(false);
    };

    // const handleCloseDialog = () => {
    //     setShowDialog(false);
    //     // 可选：清空输入字段  
    //     setName('');
    //     setDescription('');
    //     setEmail('');
    //     setExt('');
    //     setTcount('');
    //     setReward('');
    //     setStTime('');
    //     setEdTime('');

    // };
    const currentAccount = useCurrentAccount();
    const { mutate: signAndExecuteTransactionBlock } =
    useSignAndExecuteTransactionBlock();

    

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
         e.preventDefault();
        
    //     // let transferCoin: TransactionObjectArgument = txb.gas;
    //     // let nowDVD = toDust(reward, SUI_DECIMALS);
    //     // console.log("nowDVD:", nowDVD);
    //     // const send_amount = txb.splitCoins(transferCoin, [
    //     //     nowDVD
    //     // ]);
    //     // console.log("send_amount:", send_amount);
        console.log('currentAccount:', currentAccount!.address);
    //     // const [coin] = txb.splitCoins(txb.gas, [2000000000]);
    //     // 这里可以处理表单提交逻辑，比如发送到服务器  
        console.log('bagname:', bagname);
        console.log('bagtypename:', bagtypename);
        console.log('bagstatus:', bagstatus);
        console.log('PACKAGE_ID:', PACKAGE_ID);

        console.log('DetaskAdminCapid:', DetaskAdminCapid);
        console.log('BagCountid:', BagCountid);

    //     console.log('Inscription:', inscription);
    //     console.log('stTime:', convertStringToTimestamp(stTime));
    //     console.log('currentAccount:', currentAccount!.address);

        let txb = new TransactionBlock();
        txb.moveCall({
            target: `${PACKAGE_ID}::${MODULE_NAME}::${MODULE_Function_Register}`,
            arguments: [
                txb.object(DetaskAdminCapid),
                txb.object(BagCountid),
                txb.pure.string(bagname),
                txb.pure.string(bagtypename),
                txb.pure(Number(bagstatus)),
            ],
            // typeArguments: [SUI_TYPE_ARG],
        });


        txb.setSender(currentAccount!.address);

        signAndExecuteTransactionBlock(
            {
              transactionBlock: txb,
              options: {
                showObjectChanges: true,
              },
            },
            {
                async onSuccess(data) {
                console.log("registerBagtype success");
                console.log(data);
                alert("registerBagtype success");
                // setSearcherRedPacket(undefined);
                // setIsSending(false);
                // await refetchEvents();

                // enqueueSnackbar("Create task Success", {
                //   variant: "success",
                // });
              },
              onError() {
                console.log("registerBagtype error");
                alert("registerBagtype error");
                // setIsSending(false);
                // enqueueSnackbar("Create task Error", {
                //   variant: "error",
                // });
                // setSubmitting(false);
              },
            }
          );


         handleCloseDialog();
    };

    return (
        <div>
            <button type="button" className='btMove' onClick={handleOpenDialog}>BAG</button>
            {showDialog && (
                <div style={{ position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)', border: '1px solid black', padding: '20px', backgroundColor: 'black' }}>
                    <form onSubmit={handleSubmit}>
                        <label className='llabel'>bagname:</label>
                        <input type="text" value={bagname} onChange={e => setbagname(e.target.value)} required /><br />
                        <label className='llabel'>bagtypename:</label>
                        <textarea value={bagtypename} onChange={e => setbagtypename(e.target.value)} required /><br />
                        <label className='llabel'>bagstatus:</label>
                        <textarea  className='' value={bagstatus} onChange={e => setbagstatus(e.target.value)} required /><br />

                        <button type="submit" className='okButton'>
                            OK
                        </button>
                        <button type="button" onClick={handleCloseDialog}>Cancel</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default BagRegisterButton;