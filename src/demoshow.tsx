import {
    useCurrentAccount, useSuiClientQuery,
    useSuiClientQueries,
    useSuiClientInfiniteQuery,
    useSignAndExecuteTransactionBlock,
} from "@mysten/dapp-kit";
import { Flex } from "@radix-ui/themes";
import { MoveStruct, SuiEvent ,PaginatedObjectsResponse,
  SuiObjectResponse
} from "@mysten/sui.js/client";
import {
    TransactionBlock,
} from "@mysten/sui.js/transactions";

import {  useEffect, useMemo, useState } from "react";

interface showProps {
    showData: any;
}

const Demoshow: React.FC<showProps> = ({ showData}) => {
    console.log("showData:",showData);

    // const account = useCurrentAccount();
    // const { mutate: signAndExecuteTransactionBlock } =
    //     useSignAndExecuteTransactionBlock();

    return (
        <div className="card">
            {showData}
        </div>
    );
};

export default Demoshow;