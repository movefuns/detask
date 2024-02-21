import {
  useCurrentAccount, useSuiClientQuery,
  useSuiClientQueries,

  useSignAndExecuteTransactionBlock,
} from "@mysten/dapp-kit";
import { Button, Flex } from "@radix-ui/themes";
import {
  MoveStruct, SuiEvent, PaginatedObjectsResponse,
  SuiObjectResponse
} from "@mysten/sui.js/client";
import {
  TransactionBlock,
} from "@mysten/sui.js/transactions";
import {
  SUI_CLOCK_OBJECT_ID,
  SUI_DECIMALS,
  SUI_TYPE_ARG,
} from "@mysten/sui.js/utils";

import { useEffect, useMemo, useState } from "react";

import './Owned.css'
import MoveButton from "./MoveButton";
import BagRegisterButton from "./BagRegisterButton";
import TaskButton from "./TaskButton";

import {DeTaskList,MoveList,MyCard,AdminCap,DetaskCreateCap,
  DetaskNFT,ComponentAProps} from "./detasktool.tsx";

import InitmanagerCap from "./InitmanagerCap.tsx";


// 判断字符串是否为有效的网址  
function isValidUrl(str: string): boolean {
  let url;

  try {
    url = new URL(str);
  } catch (_) {
    return false;
  }

  return url.protocol === 'http:' || url.protocol === 'https:';
}

// 判断字符串是否为PNG图片地址的函数  
export function isPngImageUrl(url: string): boolean {
  return isValidUrl(url) && /\.(jpg|jpeg|png)$/i.test(url);
}

interface Props {
  // detaskEvents: any;
  // newBagCountEvents: any;
  currentlang: any;
}

// export const OwnedObjects = () => {
export const OwnedObjects: React.FC<Props> = ({currentlang}) => {
  const PACKAGE_ID = localStorage.getItem("packageId") as string;
  const MODULE_NAME = "detaskmv";
  const MODULE_NAMENFT = "denft";
  const MODULE_OWN_Admin_NAME = "DetaskAdminCap";//own
  const MODULE_OWN_Creator_Cap = "DetaskCreatorCap";//task creator
  const MODULE_OWN_DETASKNFT = "DetaskNFT";//
  const MODULE_EVENT_CREATE = "NewDetask";
  const MODULE_EVENT_BAGCOUNT = "NewBagCountCapEv";
  const MODULE_EVENT_ManagerCap = "NewDetaskManagerCapEv";
  const MODULE_EVENT_Bagtype = "NewBagTypeEv";

  const adminmode = true;

  console.log("PACKAGE_ID", PACKAGE_ID);
  console.log("MODULE_NAME", MODULE_NAME);

  //这个也要写在前面，不然报错
  const { mutate: signAndExecuteTransactionBlock } =
  useSignAndExecuteTransactionBlock();

  const account = useCurrentAccount();

  const [showDialog, setShowDialog] = useState(false);
  const [nowreward, setnowreward] = useState(0);
  const [nowReload, setReload] = useState(0);
  
  const [nowsel, setSel] = useState(0);
  const [nowselV, setnowV] = useState(0);
  const [selectedValue, setSelectedValue] = useState(""); // 初始值应该是某个option的value

  const [nowTasklist, setTasklist] = useState([]);
  // const [managerCap, setManagerCap] = useState("");
  const [isInArray, setisInArray] = useState(false);
  const [isMove, setMoveNow] = useState(false);
  const [isTask, setTaskNow] = useState(false);
  const [isBag, setBagNow] = useState(false);
  const [taskData, setTtaskData] = useState({} as DeTaskList);
  const [allObjects, setAllObjects] = useState<SuiObjectResponse[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [dvalue, setDvalue] = useState<string | null>(null);
  const [dtypev, settypev] = useState<string>("");
  const [stringArray, setStringArray] = useState<any[]>([]);
  const [stringArrayDC, setStringArrayDC] = useState<any[]>([]);
  const [stringArrayNFT, setStringArrayNFT] = useState<any[]>([]);
  
  const addStringToArray = (newString: any) => {
    console.log("addStringToArray######", newString);
    if (!stringArray.includes(newString)) {
      setStringArray(prevArray => [...prevArray, newString]);
    }
  };

  const addStringToArrayDC = (newString: DetaskCreateCap) => {
    if (!stringArrayDC.includes(newString)) {
      setStringArrayDC(prevArray => [...prevArray, newString]);
    }
  };

  const addStringToArrayNFT = (newString: DetaskNFT) => {
    if (!stringArrayNFT.includes(newString)) {
      setStringArrayNFT(prevArray => [...prevArray, newString]);
    }
  };

  //发现个小问题 useSuiClientInfiniteQuery 要写在 useSuiClientQuery 这个前面，如果不是，则报错，这算不算一个问题？

  // if(detaskEvents){
  //     console.log("detaskEvents",detaskEvents);
  // }

  // const newDeTaskEvents = useMemo(() => {
  //     return (
  //         detaskEvents?.pages.map((pEvent) =>
  //         pEvent.data.filter((event) => event.type.includes(MODULE_EVENT_CREATE))
  //       ) || []
  //     ).flat(Infinity) as SuiEvent[];
  // }, [detaskEvents]);

  // if(newMyBagypeEvents){
  //   console.log("newMyBagypeEvents############",newMyBagypeEvents);
  //   if(newMyBagypeEvents.length > 0){
  //   }
  // }

  // if(newDeTaskEvents){
  //     console.log("newDeTaskEvents",newDeTaskEvents);
  // }


  // const isErrorNetwork = useMemo(() => {
  //     return account && account?.chains[0] !== "sui:mainnet";
  //   }, [account]);//主网判断

  // const { data: ownObjectsData, isPending, error } = useSuiClientQuery(
  //     "getOwnedObjects",
  //     {
  //         owner: account?.address as string,
  //         cursor: null,
  //         options: {
  //             showContent: true,
  //             showOwner: false,
  //         },
  //     },
  //     {
  //         enabled: !!account,
  //     },
  // );

  const { data: ownObjectsData, isPending, error, refetch } = useSuiClientQuery(
    "getOwnedObjects",
    {
      owner: account?.address as string,
      cursor: cursor,
      options: {
        showContent: true,
        showOwner: false,
      },
    },
    {
      enabled: !!account,
    },
  );

  useEffect(() => {
    if (ownObjectsData) {
      setAllObjects((prevObjects) => [...prevObjects, ...ownObjectsData.data]);

      if (ownObjectsData?.hasNextPage) {
        setCursor(ownObjectsData?.nextCursor as any);
        refetch();
      }
    }
  }, [ownObjectsData]);

  if(stringArray){
    console.log("stringArray#########", stringArray,cursor,ownObjectsData?.hasNextPage);
  }

  //   const newBagCountEvents = useMemo(() => {
  //     return (
  //         detaskEvents?.pages.map((pEvent) =>
  //         pEvent.data.filter((event) => event.type.includes(MODULE_EVENT_BAGCOUNT))
  //       ) || []
  //     ).flat(Infinity) as SuiEvent[];
  // }, [detaskEvents]);



  // const newMyBagypeEvents = useMemo(() => {
  //   return (
  //     detaskEvents?.pages.map((pEvent) =>
  //       pEvent.data.filter((event) => event.type.includes(MODULE_EVENT_Bagtype))
  //     ) || []
  //   ).flat(Infinity) as SuiEvent[];
  // }, [detaskEvents]);

  //获取bag资料
  //   const { data: ownObjectBagCap } = useSuiClientQuery(
  //     "getObject",
  //     {
  //         id: "0xe8ad82b32ac0491d3889d7608cfb33ce3220458a5667021b97f8ac38a55b9748" as string,
  //         options: {
  //             showContent: true,
  //             showOwner: false,
  //         },
  //         // filter: {
  //         //     MoveModule: {
  //         //         module: MODULE_NAME,
  //         //         /** the Move package ID */
  //         //         package: PACKAGE_ID,
  //         //     },
  //         // },
  //     },
  //     {
  //         enabled: !!account,
  //     },
  // );

  // if(ownObjectBagCap){
  //     console.log("ownObjectBagCap",ownObjectBagCap);
  // }
  //0xd0cff434b86686607268857c34149a9684d121626e95e7cf34908052c1a94da0

  // const { data: ownDFBagStatus } = useSuiClientQuery(
  //     "getDynamicFields",
  //     {
  //       parentId: "0xd0cff434b86686607268857c34149a9684d121626e95e7cf34908052c1a94da0" as string,
  //     },
  //     {
  //         enabled: !!account,
  //     },
  // );
  // if(ownDFBagStatus){
  //   console.log("ownDFBagStatus",ownDFBagStatus);
  // }
  //"0x90e99e07df3c492186e4d67ba8b8c0f6e35b4f4e48ed864ea392a8895f4c5a3f::detaskmv::BagStatus"
  //value 0

  //   const { data: ownDFBagStatusObject } = useSuiClientQuery(
  //     "getDynamicFieldObject",
  //     {
  //       parentId: "0xd0cff434b86686607268857c34149a9684d121626e95e7cf34908052c1a94da0" as string,
  //       name:{
  //         type:"u64",
  //         value:"0"
  //       }
  //         // filter: {
  //         //     MoveModule: {
  //         //         module: MODULE_NAME,
  //         //         /** the Move package ID */
  //         //         package: PACKAGE_ID,
  //         //     },
  //         // },
  //     },
  //     {
  //         enabled: !!account,
  //     },
  // );

  // if(ownDFBagStatusObject){
  //   console.log("ownDFBagStatusObject",ownDFBagStatusObject);
  // }



  // if(!ncap)return;





  // const tbTasktypelist:[] = useMemo(()=>{
  //   const calTasklist:[] = tbTasklistType?.data.map((obj) => {
  //     let nowfields = [obj.name.type,obj.name.value] as any;
  //     return nowfields;
  //   });
  //   return calTasklist;

  // },[tbTasklistType]);


  // if(tbTasktypelist){
  //   console.log("tbTasktypelist", tbTasktypelist);
  // }


  // const { data: tbTasklistDetail,refetch:morefetch} = useSuiClientQuery(
  //   "getDynamicFieldObject", {
  //   parentId: tbTasklist as string,
  //   name: {
  //     type: tbTasktypelist[0][0],
  //     value: tbTasktypelist[0][1],
  //   },
  // }, {
  //   enabled: !!account,
  // });

  // if (tbTasklistDetail) {
  //   console.log("Data for tbTasktypelist item", tbTasklistDetail);
  //   // 在这里执行您的逻辑
  // }

  // const [allTasks, setallTasks] = useState<SuiObjectResponse[]>([]);
  // const { data: tbTasklistDetail} = useSuiClientQuery(
  //   "getDynamicFieldObject",
  //   {
  //     parentId: tbTasklist as string,
  //     name:{
  //       type:dtypev,
  //       value:dvalue,
  //     }
  //   },
  //   {
  //       enabled: !!account,
  //   },
  // );

  // const addStringToArray = (newString: any) => {
  //   if (!stringArray.includes(newString)) {
  //     setStringArray(prevArray => [...prevArray, newString]);
  //   }
  // };
  // useEffect(() => {
  //   if(tbTasklistDetail){
  //     console.log("tbTasklistDetail",tbTasklistDetail);
  //     // setallTasks((prevObjects) => [...prevObjects, ...tbTasklistDetail]);
  //     // addStringToArray(tbTasklistDetail.data?.content?.fields?.value);

  //   }
  //   }, [tbTasklistDetail]);
  //   useEffect(() => {
  //     if(tbTasktypelist){
  //       console.log("item###emstarttdsddddddddddddddddddddddddd");
  //       tbTasktypelist.forEach((item) => {
  //         console.log("item####",item);
  //         settypev(item[0]);
  //         setDvalue(item[1]);

  //         const obj = {
  //           method:"getDynamicFieldObject",
  //           params:{
  //             parentId: tbTasklist as string,
  //             name:{
  //               type:item[0],
  //               value:item[1],
  //             }
  //           }
  //         };
  //         addStringToArray(obj);

  //         // setDvalue("0xd73a6dc9ff5222aed93d45049767837030c74cba9835d8796c7acd311c12e0e2");
  //       });
  //     }
  //   }, [tbTasktypelist, tbTasklist, account]);

  // const { data: tbTasklistDetails} = useSuiClientQueries({
  //   queries:stringArray,
  //   combine:(result) => {
  //     return {
  //       data: result.map((res) => res.data),
  //     }
  //   }
  //  });

  //  if(tbTasklistDetails){
  //   console.log("tbTasklistDetails",tbTasklistDetails);
  //  }

  //  const [stringList, setStringList] = useState<any[]>([]);
  //  const addStringToList = (newString: any) => {
  //    if (!stringList.includes(newString)) {
  //     setStringList(prevArray => [...prevArray, newString]);
  //    }
  //  };

  //  useEffect(() => {
  //   if(tbTasklistDetails.length>0){
  //     tbTasklistDetails.forEach((item) => {
  //       console.log("tbTasklistDetails ####",item);
  //       if(item && item.data)
  //         addStringToList(item.data.content.fields.value);
  //     });
  //   }
  // }, [tbTasklistDetails, account]);

  // if(stringList){
  //   console.log("stringList", stringList);
  // }


  //  const ayTaskItemidList = useMemo(()=>{
  //   if(tbTasklistDetails.length > 0){
  //     const calTasklist = tbTasklistDetails?.map((obj) => {
  //       let nowfields = obj.data?.content.fields.value;
  //       return nowfields;
  //     });
  //     return calTasklist;
  //   }else{
  //     return [];
  //   }

  // },[tbTasklistDetails]);

  // if(ayTaskItemidList){
  //   console.log("ayTaskItemidList",ayTaskItemidList);
  // }

  //获取当前 铭文
  // const OwnObjectList: any[] = useMemo(() => {
  //   //return(
  //   const calculatedOwnObjectList: any[] =
  //     ownObjectsData?.data
  //       .filter((i) => i.data?.content?.dataType === "moveObject")
  //       .map((obj) => {
  //         let content = obj.data?.content as {
  //           dataType: "moveObject";
  //           fields: MoveStruct;
  //           hasPublicTransfer: boolean;
  //           type: string;
  //         };


  //         let nowfields = content.fields as unknown as MoveList;
  //         console.log("content",content);
          
  //         if (content.type.includes("DetaskAdminCap")) {
  //           let nowJson = content.fields as unknown as AdminCap;
  //           console.log("DetaskAdminCap", nowJson.id.id);
  //           let DetaskAdminCapid = nowJson.id.id;
  //           localStorage.setItem("DetaskAdminCapid", DetaskAdminCapid);
  //         }
  //         if(content.type.includes("DetaskCreatorCap")){
  //           let nowJson = content.fields as unknown as DetaskCreateCap;
  //           console.log("DetaskCreatorCap",nowJson);
  //           return nowJson;
  //         }
  //         if (nowfields.tick == "MOVE")
  //           return nowfields;
  //         else return null;

  //       })
  //     || []
  //   //);
  //   return calculatedOwnObjectList
  // }, [ownObjectsData, account?.address]);

  const OwnObjectList: any[] = useMemo(() => {
    //return(
    const calculatedOwnObjectList: any[] =
      ownObjectsData?.data
        .filter((i) => i.data?.content?.dataType === "moveObject")
        .map((obj) => {
          let content = obj.data?.content as {
            dataType: "moveObject";
            fields: MoveStruct;
            hasPublicTransfer: boolean;
            type: string;
          };

          //0xedd2…e7e3::detaskmv::DetaskAdminCap
          if (content.type.includes(`${PACKAGE_ID}::${MODULE_NAME}::${MODULE_OWN_Admin_NAME}`)) {
            let nowJson = content.fields as unknown as AdminCap;
            console.log("DetaskAdminCap", nowJson.id.id);
            let DetaskAdminCapid = nowJson.id.id;
            localStorage.setItem("DetaskAdminCapid", DetaskAdminCapid);
          }

          if (content.type.includes(`${PACKAGE_ID}::${MODULE_NAME}::${MODULE_OWN_Creator_Cap}`)) {
            let nowJson = content.fields as unknown as DetaskCreateCap;
            console.log("DetaskCreatorCap", nowJson.id.id);
            addStringToArrayDC(nowJson);//收集 DetaaskCreatorCap
            return nowJson;
          }

          //nft判断和过滤display
          if (content.type.includes(`${PACKAGE_ID}::${MODULE_NAMENFT}::${MODULE_OWN_DETASKNFT}`)
            && content.type.length < 100
          ) {
          //if (content.type.includes("0x45486e3eaf02da2c883fb3c6f2b2681ac0323f355f72076031423d7e04b5b84f::denft::DetaskNFT")) {
            let nowJson = content.fields as unknown as DetaskNFT;
            console.log("DetaskNFT", nowJson.id.id);
            addStringToArray(nowJson);//收集 DetaskNFT
            return nowJson;
          }

          if(content.type.includes("Movescription")){
            let nowJson = content.fields as unknown as MoveList;
            console.log("Movescription",nowJson);
            nowJson.type= content.type;
            addStringToArray(nowJson);//收集move
            return nowJson;
          }

          if (content.type.includes("MyCard")) {
            let nowJson = content.fields as unknown as MyCard;
            nowJson.type= content.type;
            console.log("MyCard",nowJson);
            addStringToArray(nowJson);//收集mycard
            return nowJson;
          }

        })
      || []
    //);
    return calculatedOwnObjectList
  }, [ownObjectsData, account?.address]);

  // if(newBagCountEvents){
  //     console.log("newBagCountEvents",newBagCountEvents);
  //     if(newBagCountEvents.length > 0){
  //       let nowJson = newBagCountEvents[0] as unknown as any;
  //       let BagCountid = nowJson?.parsedJson?.id;
  //       // console.log("BagCountid",BagCountid);
  //       localStorage.setItem("BagCountid", BagCountid);
  //     }else{
  //       return;//nothing to do
  //     }
  // }
  // if(newManagerCap){
  //   console.log("newManagerCap",newManagerCap);
  //   if(newManagerCap.length > 0){
  //     let nowJson = newManagerCap[0] as unknown as any;
  //     let ManagerCap = nowJson?.parsedJson?.id;
  //     // console.log("ManagerCap",ManagerCap);
  //     localStorage.setItem("ManagerCap", ManagerCap);
  //     // setManagerCap(ManagerCap);
  //   }else{
  //     return;//nothing to do
  //   }
  // }

  // if(OwnObjectList){
  //    console.log("OwnObjectList",OwnObjectList);
  // }

  // if(stringArray){
  //   console.log("stringArray#########", stringArray);
  // }

  //获取数据
  // const { data: multi, refetch: refetchDeTaskList } = useSuiClientQuery(
  //     "multiGetObjects",
  //     {
  //       ids:
  //         newDeTaskEvents?.map(
  //           (packet) => (packet.parsedJson as any).id as string
  //         ) || [],
  //       options: {
  //         showContent: true,
  //       },
  //     },
  //     {
  //       enabled: newDeTaskEvents && newDeTaskEvents.length > 0,
  //       refetchInterval: 10000,
  //     }
  // );
  // if(multi){
  //     console.log("multi", multi);
  // }

  // const deTaskList = useMemo(() => {
  //     return (
  //       multi
  //         ?.filter((i) => i.data?.content?.dataType === "moveObject")
  //         .map((obj) => {
  //           let content = obj.data?.content as {
  //             dataType: "moveObject";
  //             fields: MoveStruct;
  //             hasPublicTransfer: boolean;
  //             type: string;
  //           };
  //           return content.fields as unknown as DeTaskList;
  //         })
  //         .sort((a) => {
  //           if (
  //             Number(a.left_tcount) === 0 ||
  //             a.taker_addresses.includes(account?.address || "")
  //           ) {
  //             return 1;
  //           } else {
  //             return -1;
  //           }
  //         }) || []
  //     );
  //   }, [multi, account?.address]);
  //  if(deTaskList){
  //      console.log("deTaskList", deTaskList,deTaskList.length);
  //  }

  // const [showList, setShowList] = useState(false);

  if (!account) {
    return;
  }

  if (error) {
    return <Flex>Error: {error.message}</Flex>;
  }

  if (isPending || !ownObjectsData) {
    return <Flex>Loading...</Flex>;
  }

  if (ownObjectsData) {
    console.log("ownObjectsData###", ownObjectsData);
  }

  if (allObjects) {
    console.log("allObjects", allObjects);
  }


  const handleOpenDialog = () => {
    setShowDialog(true);
  };
  const handleCloseDialog = () => {
    setShowDialog(false);
  };

  // const refetchDeTaskList = () => {
  //   console.log("refetchDeTaskList now!");
  //   setReload(1);
  // };


  // const handleItemClick = (itemId: DeTaskList) => {
  //   // 在这里处理点击事件
  //   console.log('点击的项的 ID:', itemId);
  //   // 可以根据具体需求进行处理
  //   setTtaskData(itemId);
  //   setnowreward(Number(itemId.reward) / 1000000000);
  //   setisInArray(itemId.taker_addresses.includes(account!.address));
  //   handleOpenDialog();
  // }

  const handleputinto = (sel:number,nowV:any) => {
    console.log("sel", sel);
    setSel(sel);
    console.log("nowV", nowV);
    setnowV(nowV);
  }

  // const initialTask = nowTasklist.find( (task : DeTaskList) => (
  //   task.inscription === "MOVEQ" 
  //   ));  
  // const initialIndex = initialTask ? nowTasklist.indexOf(initialTask) : null;  
  // const initialValue = initialIndex !== null ? initialIndex.toString() : "";  

  const currenList = nowTasklist.map( 
    (task : DeTaskList) => {
      if( task.inscription === "MOVEQ" ){
         return task;
      }
      return null;
      }
    ).filter(Boolean); 

  const handleputinto2 = (index:number) => {
    console.log("nowTasklist", nowTasklist);
    // console.log("initialValue", initialValue);

    console.log("index", index);
    // console.log("sel", initialIndex);
    if(nowTasklist.length === 0){
      alert("没有符合条件的任务");
      return;
    }



    console.log("currenList:", currenList);

    let nTaskid = "";
    if(currenList)
      nTaskid = (currenList[nowselV as number] as DeTaskList).nid;
    console.log("task id:", nTaskid);

    let nowCard = stringArray[index];
    console.log("nowCard id: ", nowCard.id.id);

    //开始调用合约放入卡组
    const PACKAGE_ID = localStorage.getItem("packageId") as string;
    const MODULE_NAME = "detaskmv";
    const PUTINTO_FUNCTION_NAME = "putintobag";

    //找匹配的CreatorCap
    
    console.log("stringArrayDC", stringArrayDC);
    let nowDC = stringArrayDC.find(dc => dc.taskid === nTaskid);
    if(!nowDC){
      alert("只有任务创建者才能放入");
      return ;
    }
    console.log("nowDC", nowDC);
    let nowCreatorCap = nowDC.id.id;
    console.log("nowCreatorCap", nowCreatorCap);
    let nowTask = nTaskid;
    let itemid = nowCard.id.id;
    let cardtype = nowCard.type;
    let BagCountid = localStorage.getItem("BagCountid") as string;
    console.log("BagCountid", BagCountid);

    let txb = new TransactionBlock();
    txb.moveCall({
      target: `${PACKAGE_ID}::${MODULE_NAME}::${PUTINTO_FUNCTION_NAME}`,
      arguments: [
        txb.object(itemid), // item
        txb.object(BagCountid), // bag
        txb.object(nowCreatorCap), //creatorcap
        txb.object(nowTask), // task id
      ],
      typeArguments: [
        cardtype,
      ]
    });
    txb.setSender(account!.address);

    signAndExecuteTransactionBlock(
      {
        transactionBlock: txb,
        options: {
          showEvents: true,
        },
      },
      {
        async onSuccess(data) {
          console.log("put into success");
          console.log(data);
          setCursor(null);
          setAllObjects([]);//清空
          setStringArray([]);//清空
          await refetch();
          alert("put into success");
          // await refetchEvents();
          // await refetchRedPacketList();
          
          // enqueueSnackbar(
          //   `Claimed ${fromDust(claimedAmount, SUI_DECIMALS)} SUI`,
          //   {
          //     variant: "success",
          //     autoHideDuration: 5000,
          //   }
          // );
          // setIsClaiming({ ...isClaiming, [redPacket.id.id]: false });
        },
        onError() {
          console.log("put into error");
          alert("put into error");
          // enqueueSnackbar(String(error), {
          //   variant: "error",
          // });
          // setIsClaiming({ ...isClaiming, [redPacket.id.id]: false });
        },
      }
    );

  }
  // const handleputinto3 = (index:number) => {

  //   console.log("index:", index);
  //   //开始调用合约放入卡组
  //   const PACKAGE_ID = localStorage.getItem("packageId") as string;
  //   const MODULE_NAME = "detaskmv";
  //   const PUTINTO_FUNCTION_NAME = "registerFromItem";
  //   const DetaskAdminCapid = localStorage.getItem("DetaskAdminCapid") as string;

  //   let BagCountid = localStorage.getItem("BagCountid") as string;
  //   let nTaskid = (nowTasklist[initialIndex as number] as DeTaskList).nid;

  //   let nowCard = stringArray[index];
  //   console.log("nowCardArray", nowCard);
  //   let itemid = nowCard.id.id;
  //   console.log("nowCard", itemid);
  //   console.log("DetaskAdminCapid", DetaskAdminCapid);
  //   console.log("BagCountid", BagCountid);
  //   console.log("nTaskid", nTaskid);

  //   let txb = new TransactionBlock();
  //   txb.moveCall({
  //     target: `${PACKAGE_ID}::${MODULE_NAME}::${PUTINTO_FUNCTION_NAME}`,
  //     arguments: [
  //       txb.object(itemid), // item
  //       txb.object(DetaskAdminCapid), // admin cap
  //       txb.object(BagCountid), //  bag
  //       txb.object(nTaskid), // task
  //     ],
  //     typeArguments: [
  //       "0xcec3631aebdd874570c161659ec8373825239441829a7bbd797ed936e54f438b::mycard::MyCard"
  //     ]
  //   });

  //   txb.setSender(account!.address);

  //   signAndExecuteTransactionBlock(
  //     {
  //       transactionBlock: txb,
  //       options: {
  //         showEvents: true,
  //       },
  //     },
  //     {
  //       async onSuccess(data) {
  //         console.log("register into success");
  //         console.log(data);
  //         alert("register into success");
  //         // await refetchEvents();
  //         // await refetchRedPacketList();
  //         // enqueueSnackbar(
  //         //   `Claimed ${fromDust(claimedAmount, SUI_DECIMALS)} SUI`,
  //         //   {
  //         //     variant: "success",
  //         //     autoHideDuration: 5000,
  //         //   }
  //         // );
  //         // setIsClaiming({ ...isClaiming, [redPacket.id.id]: false });
  //       },
  //       onError() {
  //         console.log("put into error");
  //         alert("put into error");
  //         // enqueueSnackbar(String(error), {
  //         //   variant: "error",
  //         // });
  //         // setIsClaiming({ ...isClaiming, [redPacket.id.id]: false });
  //       },
  //     }
  //   );

  // }

  const handleSubmit = () => {
    const PACKAGE_ID = localStorage.getItem("packageId") as string;
    const MODULE_NAME = "detaskmv";
    const USERTAKE_FUNCTION_NAME = "usertaketask";
    

    let txb = new TransactionBlock();
    let detaskid = taskData.id.id;
    console.log("detaskid:", detaskid);
    txb.moveCall({
      target: `${PACKAGE_ID}::${MODULE_NAME}::${USERTAKE_FUNCTION_NAME}`,
      arguments: [
        txb.object(detaskid),
      ],
    });
    txb.setSender(account!.address);

    signAndExecuteTransactionBlock(
      {
        transactionBlock: txb,
        options: {
          showEvents: true,
        },
      },
      {
        async onSuccess(data) {
          console.log("user take success");
          console.log(data);
          alert("take task success");
          // await refetchEvents();
          // await refetchRedPacketList();
          // enqueueSnackbar(
          //   `Claimed ${fromDust(claimedAmount, SUI_DECIMALS)} SUI`,
          //   {
          //     variant: "success",
          //     autoHideDuration: 5000,
          //   }
          // );
          // setIsClaiming({ ...isClaiming, [redPacket.id.id]: false });
        },
        onError() {
          console.log("user take error");
          alert("take task error");
          // enqueueSnackbar(String(error), {
          //   variant: "error",
          // });
          // setIsClaiming({ ...isClaiming, [redPacket.id.id]: false });
        },
      }
    );

    handleCloseDialog();
  };

  return (
    <Flex direction="column" my="2">
      <Flex justify="start">
        {/* 创建按钮 */}
        {/* <CreateDetask refetchDeTaskList={refetchDeTaskList} /> */}
        {/* 任务 */}
        <TaskButton setTaskNow={setTaskNow} setMoveNow={setMoveNow} />
        {/* Move按钮 */}
        <MoveButton setMoveNow={setMoveNow} setTaskNow={setTaskNow} refetch={refetch} setAllObjects={setAllObjects} setCursor={setCursor} setStringArray={setStringArray}/>
        {/* Bag按钮 */}
        {/* <BagRegisterButton setBagNow={setBagNow} /> */}
        <button>GAME</button>
        <button>IDO</button>

      </Flex>
      <Flex direction="column" my="2">

        {/* {ownObjectsData.data.length === 0 ? (
                <Text>No objects owned by the connected wallet</Text>
            ) : (
                <Heading size="4">Objects owned by the connected wallet</Heading>
            )}
            {ownObjectsData.data.map((object) => (
                <Flex key={object.data?.objectId}>
                    <Text>Object ID: {object.data?.objectId}</Text>
                </Flex>
            ))} */}


        {
          isMove == false ? (
            <>
              <InitmanagerCap 
                nowTasklist={nowTasklist} 
                setTasklist={setTasklist} 
                stringArrayDC={stringArrayDC} 
                currentlang={currentlang}
                />
              {/* {
                deTaskList.map((item) => (
                    <div className="tasklistitem" onClick={() => handleItemClick(item)}>
                    <TaskList 
                        taskData = {item}
                    />
                    </div>
                ))
              } */}
              {showDialog && (
                <div className="topDialog"
                  style={{ position: 'fixed', top: '10%', left: '20%', transform: 'translateX(-50%)', border: '1px solid black', padding: '20px', backgroundColor: 'black' }}>
                  <h1>任务详情</h1>

                  {
                    "MOVEQ" == taskData.inscription ? (
                      <>
                        <p>悬赏任务 : {taskData.deName} </p>
                        <p>悬赏 : {taskData.inscription}</p>
                        <p>奖励 : MOVE </p>
                      </>
                    ) : (
                      "COUPON" == taskData.inscription ?
                        (
                          <>
                            <p>活动名 : {taskData.deName} </p>
                            <p>优惠券 : {taskData.inscription}</p>
                            <p>价值 : ￥{nowreward} </p>
                          </>
                        ) : (
                          <>
                            <p>任务名 : {taskData.deName} </p>
                            <p>类型 : {taskData.inscription}</p>
                            <p>完成奖励 : {nowreward} SUI</p>
                          </>
                        )
                    )
                  }

                  <p>完成进度 : {taskData.tcount - taskData.left_tcount} / {taskData.tcount}</p>
                  <p className='describetitle'>详细要求 </p>
                  <textarea className="describe" readOnly>
                    {taskData.describe}
                  </textarea>

                  <p>邮箱 : {taskData.email}</p>
                  <p>其他 :
                    {
                      isPngImageUrl(taskData.ext) ?
                        (<img src={taskData.ext} alt="图片" />) :
                        (taskData.ext)
                    }
                  </p>
                  {
                    0 == taskData.left_tcount ? (
                      <span className='okButtonFull'>任务已满</span>
                    ) : (
                      !isInArray ? (
                        <button type="button" className='okButton' onClick={handleSubmit}>
                          <span>确定接取任务</span>
                        </button>
                      ) : (
                        <span className='okButtonFull'>您已接受</span>
                      )
                    )
                  }

                  <button type="button" onClick={handleCloseDialog}>
                    取消
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              {
                stringArray.map((object, index) => (
                  <Flex key={index}>
                    {
                      object.tick ?(
                        <span>
                          $MOVE {index + 1}: {object?.id.id} amt:{object?.amount}
                          <select className="selectname" onChange={(event) => handleputinto(index, event.target.value)}>
                            {currenList.map((item:any,index) => (  
                              // 判断是否是悬赏任务并且自己是建立者
                              "MOVEQ" === item.inscription && (
                              <option key={index} value={index}>  
                                {item.deName}  
                              </option>  
                              )
                            ))}  
                          </select>  
                        </span>
                      ):(
                        <span>
                          $card {index + 1}: {object?.id.id} cardNo:{object?.nid}
                          <select className="selectname" onChange={(event) => handleputinto(index, event.target.value)}>
                            {currenList.map((item:any,index2) => (  
                              // 判断是否是悬赏任务并且自己是建立者
                              "MOVEQ" === item.inscription && (
                              <option key={index2} value={index2}>  
                                {item.deName}  
                              </option>  
                              )
                            ))}  
                          </select>  
                        </span>
                      )
                    }
                    <button className="putitemin" type="button" onClick={() => handleputinto2(index)} >放入</button>
                    {/* <button type="button" onClick={() => handleputinto3(index)} >注册</button> */}
                  </Flex>
                ))
              }
            </>
          )
        }





      </Flex>

    </Flex>
  );
}
