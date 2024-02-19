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
import './Create.css'
import lang from "./tools/lang.json"


interface Props {
    refetchDeTaskList: any; // 根据 useNetworkVariable 的类型进行定义
    currentlang: any; // 根据 useNetworkVariable 的类型进行定义
  }


function toDust(val: BigNumber | number | string, decimal: number | bigint): bigint {
    return bigNumberToBigInt(toDustBigNumber(val, decimal));
}
function bigNumberToBigInt(val: BigNumber | number | string): bigint {
    const str = toBigNumber(val).toString();
    return BigInt(str);
}

function toDustBigNumber(val: BigNumber | number | string, decimal: number | bigint): BigNumber {
    return toBigNumber(val).times(new BigNumber(10).pow(decimal.toString()));
}

function bigIntToBigNumber(val: bigint) {
    return BigNumber(val.toString());
}

function toBigNumber(val?: BigNumber | bigint | number | string | BigNumber.Instance): BigNumber {
    if (val instanceof BigNumber || (BigNumber.isBigNumber(val) && typeof val === 'object')) {
        return val
    }
    if (typeof val === 'number' || typeof val === 'string') {
        return BigNumber(val);
    }
    if (typeof val === 'bigint') {
        return bigIntToBigNumber(val);
    }
    if (typeof val === 'undefined') {
        return BigNumber(0);
    }
    return BigNumber(val);
}

function convertStringToTimestamp(stTime : string) {
    var date = new Date(stTime);
    return date.getTime();
}

const CreateDetask: React.FC<Props> = ({refetchDeTaskList,currentlang}) => {
    const PACKAGE_ID = localStorage.getItem("packageId") as string;
    const MODULE_NAME = "detaskmv";
    const CREATE_FUNCTION_NAME = "createtask";
    const ManagerCap = localStorage.getItem("ManagerCap");

    const [showDialog, setShowDialog] = useState(false);
    const [deName, setName] = useState('');
    const [inscription, setInscription] = useState('');
    const [describe, setDescription] = useState('');
    const [email, setEmail] = useState('');
    const [ext, setExt] = useState('');
    const [img, setImg] = useState('');
    const [tcount, setTcount] = useState('');
    const [reward, setReward] = useState('');

    const [stTime, setStTime] = useState('');
    const [edTime, setEdTime] = useState('');
    const [ttype, setTtype] = useState('');

    const nLang = lang as any;

    const handleOpenDialog = () => {
        setShowDialog(true);
    };

    const handleCloseDialog = () => {
        setShowDialog(false);
        // 可选：清空输入字段  
        setName('');
        setDescription('');
        setEmail('');
        setExt('');
        setTcount('');
        setReward('');
        setStTime('');
        setEdTime('');

    };
    const currentAccount = useCurrentAccount();
    const { mutate: signAndExecuteTransactionBlock } =
    useSignAndExecuteTransactionBlock();

    

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        // let transferCoin: TransactionObjectArgument = txb.gas;
        // let nowDVD = toDust(reward, SUI_DECIMALS);
        // console.log("nowDVD:", nowDVD);
        // const send_amount = txb.splitCoins(transferCoin, [
        //     nowDVD
        // ]);
        // console.log("send_amount:", send_amount);
        console.log('currentAccount:', currentAccount!.address);
        // const [coin] = txb.splitCoins(txb.gas, [2000000000]);
        // 这里可以处理表单提交逻辑，比如发送到服务器  
        console.log('Name:', deName);
        console.log('Description:', describe);
        console.log('Inscription:', inscription);
        console.log('PACKAGE_ID:', PACKAGE_ID);
        console.log('Inscription:', inscription);
        console.log('ManagerCap:', ManagerCap);
        console.log('stTime:', convertStringToTimestamp(stTime));
        console.log('currentAccount:', currentAccount!.address);

        let txb = new TransactionBlock();
        txb.moveCall({
            target: `${PACKAGE_ID}::${MODULE_NAME}::${CREATE_FUNCTION_NAME}`,
            arguments: [
                txb.gas,
                txb.object(ManagerCap as string),
                txb.pure.string(deName),
                txb.pure.string(inscription),
                txb.pure.string(describe),
                txb.pure.string(email),
                txb.pure.string(ext),
                txb.pure.string(img),
                txb.pure(Number(toDust(reward, SUI_DECIMALS))),
                txb.pure(Number(tcount)),
                txb.pure(Number(convertStringToTimestamp(stTime))),
                txb.pure(Number(convertStringToTimestamp(edTime))),
                txb.pure(Number(ttype)),
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
                console.log("create success");
                console.log(data);
                alert("create success");
                // setSearcherRedPacket(undefined);
                // setIsSending(false);
                // await refetchEvents();
                await refetchDeTaskList();

                // enqueueSnackbar("Create task Success", {
                //   variant: "success",
                // });
              },
              onError() {
                console.log("create error");
                alert("create error");
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
            <button type="button" onClick={handleOpenDialog}>{nLang[currentlang].create}</button>
            {showDialog && (
                <div className='topDialog' style={{ position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)', border: '1px solid black', padding: '20px', backgroundColor: 'black' }}>
                    <form onSubmit={handleSubmit}>
                        <label className='llabel'>task name:</label>
                        <input type="text" value={deName} onChange={e => setName(e.target.value)} required /><br />
                        <label className='llabel'>inscription:</label>
                        <textarea className='inscriptionclass' value={inscription} onChange={e => setInscription(e.target.value)} required /><br />
                        <label className='llabeldes'>describe:</label>
                        <textarea  className='ltextarea' value={describe} onChange={e => setDescription(e.target.value)} required /><br />
                        <label className='llabel'>email:</label>
                        <input className='llabeltext' type="text" value={email} onChange={e => setEmail(e.target.value)} required /><br />
                        <label className='llabel'>ext:</label>
                        <input className='llabeltext' type="text" value={ext} onChange={e => setExt(e.target.value)} required /><br />
                        <label className='llabel'>img:</label>
                        <input className='llabeltext' type="text" value={img} onChange={e => setImg(e.target.value)} required /><br />
                        <label className='llabel'>total task numbers:</label>
                        <input className='llabeltext' type="number" value={tcount} onChange={e => setTcount(e.target.value)} required /><br />
                        <label className='llabel'>reward SUI:</label>
                        <input type="number" value={reward} onChange={e => setReward(e.target.value)} required /><br />

                        <label className='llabel'>ttype:</label>
                        <input className='llabeltext' type="number" value={ttype} onChange={e => setTtype(e.target.value)} required /><br />

                        <label className='llabel'>Start Time:</label>
                        <input className='llabeltext' type="datetime-local" value={stTime} onChange={e => setStTime(e.target.value)} required /><br />
                        <label className='llabel'>End Time:</label>
                        <input className='llabeltext' type="datetime-local" value={edTime} onChange={e => setEdTime(e.target.value)} required /><br />

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

export default CreateDetask;