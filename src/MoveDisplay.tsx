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
// import './MoveDisplay.css'


interface Props {
     content: any;
}

const MoveDisplay : React.FC<Props> = ({content}) => {

    const nowct = content;

    return (
        <>
        {
            content?.fields?.tick ? (
            <span>Move Amt: {content?.fields?.amount} </span>
            ):(
            <span>CardId nid: {content?.fields?.nid} hp:{content?.fields?.hp}</span>
            )
        }
        </>
    );
};

export default MoveDisplay;