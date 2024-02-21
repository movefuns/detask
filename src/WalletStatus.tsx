import { useCurrentAccount, useSuiClientInfiniteQuery, } from "@mysten/dapp-kit";
import { Container, Flex, Heading, Text } from "@radix-ui/themes";
import { OwnedObjects } from "./OwnedObjects";
// import LowString from "./LowString";
import { useEffect, useMemo, useState } from "react";
import {
  MoveStruct, SuiEvent, PaginatedObjectsResponse,
  SuiObjectResponse
} from "@mysten/sui.js/client";

import lang from "./tools/lang.json"

export interface ComponentProps {
  currentlang: any;
}

export const WalletStatus:React.FC<ComponentProps> = ({currentlang}) => {
  // const account = useCurrentAccount();  
  const PACKAGE_ID = localStorage.getItem("packageId") as string;
  const MODULE_NAME = "detaskmv";
  const MODULE_EVENT_BAGCOUNT = "NewBagCountCapEv";
  const MODULE_EVENT_ManagerCap = "NewDetaskManagerCapEv";

  const [managerCap, setManagerCap] = useState("");
  const nLang = lang as any;


  const {
    data: detaskEvents,
    refetch: refetchEvents,
    fetchNextPage,
    hasNextPage,
  } = useSuiClientInfiniteQuery(
    "queryEvents",
    {
      query: {
        MoveModule: {
          package: PACKAGE_ID,
          module: MODULE_NAME,
        },
      },
      order: "descending",
    },
    {
      refetchInterval: 10000,
    }
  );

  const newBagCountEvents = useMemo(() => {
    return (
      detaskEvents?.pages.map((pEvent) =>
        pEvent.data.filter((event) => event.type.includes(MODULE_EVENT_BAGCOUNT))
      ) || []
    ).flat(Infinity) as SuiEvent[];
  }, [detaskEvents]);

  const newManagerCap = useMemo(() => {
    return (
      detaskEvents?.pages.map((pEvent) =>
        pEvent.data.filter((event) => event.type.includes(MODULE_EVENT_ManagerCap))
      ) || []
    ).flat(Infinity) as SuiEvent[];
  }, [detaskEvents]);

  if (newBagCountEvents) {
    console.log("newBagCountEvents", newBagCountEvents);
    if (newBagCountEvents.length > 0) {
      let nowJson = newBagCountEvents[0] as unknown as any;
      let BagCountid = nowJson?.parsedJson?.id;
      // console.log("BagCountid",BagCountid);
      localStorage.setItem("BagCountid", BagCountid);
    }
  }

  if (newManagerCap) {
    console.log("newManagerCap", newManagerCap);
    if (newManagerCap.length > 0) {
      let nowJson = newManagerCap[0] as unknown as any;
      let ManagerCap = nowJson?.parsedJson?.id;
      console.log("ManagerCap", ManagerCap);
      localStorage.setItem("ManagerCap", ManagerCap);
      // setManagerCap(ManagerCap);
    }
  }

  return (
    <Container my="2">
      <Heading mb="2">{nLang[currentlang].logo} FindWork</Heading>

      {/* {account ? ( */}
      <Flex direction="column">
        {/* <Text>Wallet connected 钱包已连接</Text> */}
        {/* <Text>Address: <LowString text={account.address as string}></LowString></Text> */}

      </Flex>
      {/* ) : (
        <Text>Wallet not connected 钱包未连接</Text>
      )
      } */}
      <OwnedObjects
        currentlang = {currentlang}
        // detaskEvents={detaskEvents}
        // newBagCountEvents={newBagCountEvents}
      />
    </Container>
  );
}
