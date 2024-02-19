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

import { BigNumber } from 'bignumber.js';
import { enqueueSnackbar } from "notistack";
// import './TaskButton.css'


interface Props {
     taskNow: any; // 根据 useNetworkVariable 的类型进行定义
}

const SendToButton : React.FC<Props> = ({taskNow}) => {
    const PACKAGE_ID = localStorage.getItem("packageId") as string;
    const MODULE_NAME = "detaskmv";
    // const CREATE_FUNCTION_NAME = "createtask";

    // const [showDialog, setShowDialog] = useState(false);
    // const [deName, setName] = useState('');
    // const [inscription, setInscription] = useState('');
    // const [describe, setDescription] = useState('');
    // const [email, setEmail] = useState('');
    // const [ext, setExt] = useState('');
    // const [tcount, setTcount] = useState('');
    // const [reward, setReward] = useState('');

    // const [stTime, setStTime] = useState('');
    // const [edTime, setEdTime] = useState('');

    const handleOpenDialog = () => {
        console.log("handleOpenDialog SendTo:",taskNow);
    }

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
    // const currentAccount = useCurrentAccount();
    // const { mutate: signAndExecuteTransactionBlock } =
    // useSignAndExecuteTransactionBlock();

    

    // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    //     e.preventDefault();
        
    //     // let transferCoin: TransactionObjectArgument = txb.gas;
    //     // let nowDVD = toDust(reward, SUI_DECIMALS);
    //     // console.log("nowDVD:", nowDVD);
    //     // const send_amount = txb.splitCoins(transferCoin, [
    //     //     nowDVD
    //     // ]);
    //     // console.log("send_amount:", send_amount);
    //     console.log('currentAccount:', currentAccount!.address);
    //     // const [coin] = txb.splitCoins(txb.gas, [2000000000]);
    //     // 这里可以处理表单提交逻辑，比如发送到服务器  
    //     console.log('Name:', deName);
    //     console.log('Description:', describe);
    //     console.log('Inscription:', inscription);
    //     console.log('PACKAGE_ID:', PACKAGE_ID);
    //     console.log('Inscription:', inscription);
    //     console.log('stTime:', convertStringToTimestamp(stTime));
    //     console.log('currentAccount:', currentAccount!.address);

    //     let txb = new TransactionBlock();
    //     txb.moveCall({
    //         target: `${PACKAGE_ID}::${MODULE_NAME}::${CREATE_FUNCTION_NAME}`,
    //         arguments: [
    //             txb.gas,
    //             txb.pure.string(deName),
    //             txb.pure.string(inscription),
    //             txb.pure.string(describe),
    //             txb.pure.string(email),
    //             txb.pure.string(ext),
    //             txb.pure(Number(toDust(reward, SUI_DECIMALS))),
    //             txb.pure(Number(tcount)),
    //             txb.pure(Number(convertStringToTimestamp(stTime))),
    //             txb.pure(Number(convertStringToTimestamp(edTime)))
    //         ],
    //         // typeArguments: [SUI_TYPE_ARG],
    //     });


    //     txb.setSender(currentAccount!.address);

    //     signAndExecuteTransactionBlock(
    //         {
    //           transactionBlock: txb,
    //           options: {
    //             showObjectChanges: true,
    //           },
    //         },
    //         {
    //             async onSuccess(data) {
    //             console.log("create success");
    //             console.log(data);
    //             alert("create success");
    //             // setSearcherRedPacket(undefined);
    //             // setIsSending(false);
    //             // await refetchEvents();
    //             await refetchDeTaskList();

    //             // enqueueSnackbar("Create task Success", {
    //             //   variant: "success",
    //             // });
    //           },
    //           onError() {
    //             console.log("create error");
    //             alert("create error");
    //             // setIsSending(false);
    //             // enqueueSnackbar("Create task Error", {
    //             //   variant: "error",
    //             // });
    //             // setSubmitting(false);
    //           },
    //         }
    //       );


    //     handleCloseDialog();
    // };

    return (
        <div>
            <button type="button" className='btSendTo' onClick={handleOpenDialog}>赠送2</button>

        </div>
    );
};

export default SendToButton;