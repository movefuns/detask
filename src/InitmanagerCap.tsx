import {
    useCurrentAccount, useSuiClientQuery,
    useSuiClientQueries,
  
    useSignAndExecuteTransactionBlock,
  } from "@mysten/dapp-kit";
  import { Flex } from "@radix-ui/themes";
  import {
    MoveStruct, SuiEvent, PaginatedObjectsResponse,
    SuiObjectResponse,
    SuiParsedData
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
  import CreateDetask from "./CreateDetask";
  import TaskList from "./TaskList";
    
import {DeTaskList,MoveList,MyCard,AdminCap,DetaskCreateCap,
    DetaskNFT,ComponentAProps} from "./detasktool.tsx";

import {isPngImageUrl} from "./OwnedObjects.tsx";
import LowString from "./LowString.tsx";
import "./initmanager.css"
import SendToButton from "./SendToButton.tsx";
import MoveDisplay from "./MoveDisplay.tsx";

const InitmanagerCap: React.FC<ComponentAProps> = ({nowTasklist,setTasklist,stringArrayDC,currentlang}) => {
    let ncap = localStorage.getItem("ManagerCap");
  
    //获取 task manager cap 资料
    const { data: ObjectManagerCap } = useSuiClientQuery(
      "getObject",
      {
        id: ncap as string,
        options: {
          showContent: true,
          showOwner: false,
        },
      },
    );
    // if(ObjectManagerCap){
    console.log("ObjectManagerCap", ObjectManagerCap);
    // console.log(
    //   ObjectManagerCap?.data?.content.fields.tbtask.fields.id.id
    // );
    // }
    return <InitTasklist 
      data={ObjectManagerCap} 
      nowTasklist={nowTasklist} 
      setTasklist={setTasklist} 
      stringArrayDC={stringArrayDC} 
      currentlang={currentlang}
    />;
};
export default InitmanagerCap;

interface ComponentBProps {
    // 声明组件A的props类型
    data: any;
    nowTasklist: any;
    setTasklist: any;
    stringArrayDC: any;
    currentlang:any;
  }
  
  
  //获取taskTable的id
export const InitTasklist: React.FC<ComponentBProps> = ({ data,nowTasklist,setTasklist,stringArrayDC,currentlang}) => {

    // console.log("data", data);
  
    const tbTasklist = data?.data?.content?.fields?.tbtask?.fields?.id.id;
  
    if (!tbTasklist) {
      console.log("tbTasklist no id");
      return [];
    }
  
    const { data: tbTasklistType,refetch:refetchEvents } = useSuiClientQuery(
      "getDynamicFields",
      {
        parentId: tbTasklist as string,
      },
    );
    if (tbTasklistType) {
      console.log("tbTasklistType", tbTasklistType);
    }
    return <TbTasklist 
      data={tbTasklistType} 
      tbTasklist={tbTasklist} 
      refetchEvents={refetchEvents} 
      nowTasklist={nowTasklist} 
      setTasklist={setTasklist} 
      stringArrayDC={stringArrayDC} 
      currentlang={currentlang}
      />;
  }
  
  
  
  // 获取所有tasklist
  interface ComponentCProps {
    // 声明组件A的props类型
    data: any;
    tbTasklist: any;
    refetchEvents: any;
    nowTasklist: any;
    setTasklist: any;
    stringArrayDC: any;
    currentlang: any;
  }
  
  const TbTasklist: React.FC<ComponentCProps> = ({ data, tbTasklist ,refetchEvents,nowTasklist,setTasklist,stringArrayDC,currentlang}) => {
  
    const tbTasktypelist: [] = useMemo(() => {
      const calTasklist: [] = data?.data.map((obj: any) => {
        let nowfields = [obj.name.type, obj.name.value] as any;
        return nowfields;
      });
      return calTasklist;
  
    }, [data]);
  
    let nowtasklisttype = [] as any;
    if (tbTasktypelist) {
      console.log("tbTasktypelist", tbTasktypelist);
      tbTasktypelist.forEach((item) => {
        console.log("item####", item);
        const obj = {
          method: "getDynamicFieldObject",
          params: {
            parentId: tbTasklist as string,
            name: {
              type: item[0],
              value: item[1],
            }
          }
        };
        nowtasklisttype.push(obj);
      });
      // console.log("nowtasklisttype", nowtasklisttype);
    }
  
  
  
    return <TbTasklistRealId 
      nowtasklisttype={nowtasklisttype} 
      refetchEvents={refetchEvents} 
      nowTasklist={nowTasklist} 
      setTasklist={setTasklist} 
      stringArrayDC={stringArrayDC} 
      currentlang={currentlang} 
      />;
  }
  
  // 获取所有tasklist 实际id
  interface ComponentDProps {
    // 声明组件A的props类型
    // tbTasklistDetail: any;
    nowtasklisttype: any;
    refetchEvents: any;
    nowTasklist: any;
    setTasklist: any;
    stringArrayDC: any;
    currentlang: any;
  
  }
  const TbTasklistRealId: React.FC<ComponentDProps> = ({ nowtasklisttype,refetchEvents,nowTasklist,setTasklist,stringArrayDC,currentlang }) => {
    console.log("nowtasklisttype", nowtasklisttype);
    const { data: tbTasklistDetails } = useSuiClientQueries({
      queries: nowtasklisttype,
      combine: (result) => {
        return {
          data: result.map((res) => res.data),
        }
      }
    });
  
    if (tbTasklistDetails) {
      console.log("tbTasklistDetails", tbTasklistDetails);
    }
  
    return <TbTasklistRealList 
      dataDetails={tbTasklistDetails} 
      refetchEvents={refetchEvents} 
      nowTasklist={nowTasklist} 
      setTasklist={setTasklist} 
      stringArrayDC={stringArrayDC} 
      currentlang={currentlang} 
      />;
  }
  
  interface ComponentEProps {
    // 声明组件A的props类型
    // tbTasklistDetail: any;
    dataDetails: any;
    refetchEvents: any;
    nowTasklist: any;
    setTasklist: any;
    stringArrayDC: any;
    currentlang: any;
  }
  const TbTasklistRealList: React.FC<ComponentEProps> = ({ dataDetails,refetchEvents,nowTasklist,setTasklist,stringArrayDC,currentlang}) => {
  
    const ayTaskItemidList: [] = useMemo(() => {
      //   if(dataDetails.length > 0){
      const calTasklist = dataDetails?.map((obj: any) => {
        let nowfields = [obj?.data?.content.fields.value];
        return nowfields;
      });
      return calTasklist;
      //   }else{
      //     return [];
      //   }
    }, [dataDetails]);
  
    if (ayTaskItemidList) {
      console.log("ayTaskItemidList", ayTaskItemidList);
    }
    ayTaskItemidList.forEach((item) => {
      console.log("item", item);
    });
  
    //获取数据
    const { data: multi, refetch: refetchDeTaskList } = useSuiClientQuery(
      "multiGetObjects",
      {
        ids:
          ayTaskItemidList?.map(
            (packet) => (packet[0]) as string
          ) || [],
        options: {
          showContent: true,
        },
      },
      {
        enabled: ayTaskItemidList && ayTaskItemidList.length > 0,
        // refetchInterval: 10000,
      }
    );
    if (multi) {
      console.log("multi: ", multi);
    }
  
    const deTaskList = useMemo(() => {
      return (
        multi
          ?.filter((i) => i.data?.content?.dataType === "moveObject")
          .map((obj) => {
            let content = obj.data?.content as {
              dataType: "moveObject";
              fields: MoveStruct;
              hasPublicTransfer: boolean;
              type: string;
            };
            return content.fields as unknown as DeTaskList;
          })
        // .sort((a) => {
        //   if (
        //     Number(a.left_tcount) === 0 ||
        //     a.taker_addresses.includes(account?.address || "")
        //   ) {
        //     return 1;
        //   } else {
        //     return -1;
        //   }
        // }) || []
      );
    }, [multi]);
    // if (deTaskList) {
    //   console.log("deTaskList", deTaskList, deTaskList.length);
    //   if(deTaskList.length > 0){
    //     setTasklist(deTaskList);
    //   }else{
    //     nowTasklist([{daName: "no task"}]);
    //   }
    // }
    useEffect(() => {
        
        if(deTaskList){
          console.log("deTaskList", deTaskList, deTaskList.length);
         if((deTaskList as any) .length > 0){
        setTasklist(deTaskList);
         }else{
           //nowTasklist([{daName: "no task"}]);
         }
        }
    },[deTaskList]);

  
    const account = useCurrentAccount();
    if (!account) {
      return;
    }
    const [showDialog, setShowDialog] = useState(false);
    const [taskData, setTtaskData] = useState({} as DeTaskList);
    const [nowreward, setnowreward] = useState(0);
    const [nowBagid, setBagId] = useState("0");
    const [nowTakerid, seTakerId] = useState("0");
    const [isInArray, setisInArray] = useState(false);
    const [isTaskCreator, setTaskCreator] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
    const { mutate: signAndExecuteTransactionBlock } =
      useSignAndExecuteTransactionBlock();
  

    const { data: tbBaglistType,refetch:refetchQuery } = useSuiClientQuery(
      "getDynamicFields",
      {
        parentId: nowBagid,
      },
    );
    if (tbBaglistType) {
      console.log("tbBaglistType", tbBaglistType);
    }

    const itemlistid = useMemo(() => {
      
      const calList = tbBaglistType?.data.map((obj:any) =>{
        let nowvalue = obj.name.value;
        return nowvalue;
      });
      return calList;

    },[tbBaglistType]);
    if(itemlistid){
      console.log("itemlistid", itemlistid);
    }

    //获取数据
    const { data: multiItem, refetch: refetchItemList } = useSuiClientQuery(
      "multiGetObjects",
      {
        ids:
          itemlistid|| [],
        options: {
          showContent: true,
        },
      },
      {
        enabled: itemlistid && itemlistid.length > 0,
        // refetchInterval: 10000,
      }
    );
    //task list
    if (multiItem) {
      console.log("multiItem: ", multiItem);
    }

    const { data: tbTakerlistType,refetch:refetchTkQuery } = useSuiClientQuery(
      "getDynamicFields",
      {
        parentId: nowTakerid,
      },
    );
    if (tbTakerlistType) {
      console.log("tbTakerlistType", tbTakerlistType);
    }
    const itemTakerlistid = useMemo(() => {
      
      const calList = tbTakerlistType?.data.map((obj:any) =>{
        let nowvalue = obj.objectId;
        return nowvalue;
      });
      return calList;

    },[tbTakerlistType]);
    if(itemTakerlistid){
      console.log("itemTakerlistid", itemTakerlistid);
    }
    //获取数据
    const { data: multiTakerItem, refetch: refetchTakerItemList } = useSuiClientQuery(
      "multiGetObjects",
      {
        ids:
        itemTakerlistid|| [],
        options: {
          showContent: true,
        },
      },
      {
        enabled: itemTakerlistid && itemTakerlistid.length > 0,
        // refetchInterval: 10000,
      }
    );
    //task list
    if (multiTakerItem) {
      console.log("multiTakerItem: ", multiTakerItem);
    }



    const handleItemClick = (itemId: DeTaskList) => {
      // 在这里处理点击事件
      console.log('点击的项的 ID:', itemId);
      // 可以根据具体需求进行处理
      setTtaskData(itemId);
      setnowreward(Number(itemId.reward) / 1000000000);
      setisInArray(itemId.taker_addresses.includes(account!.address));
      
      //获取详细包裹内容
      let bagId = itemId.baglist.fields.id.id;
      console.log('bag ID:', bagId);
      setBagId(bagId);//根据taskid 获取背包内容

      let nTaskid = itemId.nid;
      let nowDC = stringArrayDC.find((dc:any) => dc.taskid === nTaskid);
      console.log("nowDC", nowDC);
      if(nowDC){
        setTaskCreator(true);
      }else{
        setTaskCreator(false);
      }
      let takerId = itemId.taker_list.fields.id.id;
      console.log('takerId ID:', takerId);
      seTakerId(takerId);//根据takerId 获取takerlist内容

      handleOpenDialog();
    }

    const handleItemClickCardList = (itemId:number) => {
      console.log("itemId", itemId);
      // const  sele
      setSelectedItemId(itemId);
    };

    const handleOpenDialog = () => {
      setShowDialog(true);
    };
    const handleCloseDialog = () => {
      setShowDialog(false);
    };
  
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
            await refetchEvents();
            await refetchDeTaskList();
            
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

    const handleItemBack = (index:number) => {
      const PACKAGE_ID = localStorage.getItem("packageId") as string;
      const MODULE_NAME = "detaskmv";
      const USERTAKE_FUNCTION_NAME = "backtoSender";
      console.log("handleItemBack index :", index);
      let nowitem = multiItem?.[index];
      console.log("nowitem:", nowitem);
      
      // let nowCardid = nowitem?.data?.content?.fields?.id.id;
      
      let content = nowitem?.data?.content as {
        dataType: "moveObject";
        fields: MoveStruct;
        hasPublicTransfer: boolean;
        type: string;
      };
      let nowCardFields = (content?.fields) as unknown as MyCard;
      let nowCardid = nowCardFields.id.id;

      console.log("nowCardid:", nowCardid);

      let nTaskid = taskData.id.id;
      let nowDC = stringArrayDC.find((dc:any) => dc.taskid === nTaskid);
      //console.log("nowDC", nowDC);
      let nowCreatorCap = nowDC.id.id;
      console.log("nowCreatorCap", nowCreatorCap);

      let BagCountid = localStorage.getItem("BagCountid") as string;
      console.log("BagCountid", BagCountid);
      
      console.log("detaskid:", nTaskid);

      // let nowType = nowitem?.data?.content?.type as string;
       let nowType = content.type as string;

      console.log("nowType:", nowType);


      let txb = new TransactionBlock();
      txb.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::${USERTAKE_FUNCTION_NAME}`,
        arguments: [
          txb.object(nowCardid),
          txb.object(nowCreatorCap),
          txb.object(BagCountid),
          txb.object(nTaskid),
        ],
        typeArguments: [
          nowType,
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
            console.log("backtosender success");
            console.log(data);
            alert("backtosender success");
            // await refetchEvents();
            // await refetchDeTaskList();
            await refetchQuery();
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
            console.log("backtosender error");
            alert("backtosender error");
            // enqueueSnackbar(String(error), {
            //   variant: "error",
            // });
            // setIsClaiming({ ...isClaiming, [redPacket.id.id]: false });
          },
        }
      );

    };

    const handleItemSend = (item:string) => {
      const PACKAGE_ID = localStorage.getItem("packageId") as string;
      const MODULE_NAME = "detaskmv";
      const USERTAKE_FUNCTION_NAME = "sendtouser";
      
      //当前选择了哪个
      console.log("selectedItemId:",selectedItemId);

      let nowitem = multiItem?.[selectedItemId as number];
      console.log("nowitem:", nowitem);
      
      // let nowCardid = nowitem?.data?.content?.fields?.id.id;
      let content = nowitem?.data?.content as {
        dataType: "moveObject";
        fields: MoveStruct;
        hasPublicTransfer: boolean;
        type: string;
      };
      let nowCardFields = (content?.fields) as unknown as MyCard;
      let nowCardid = nowCardFields.id.id;

      console.log("nowCardid:", nowCardid);
      
      // let nowType = nowitem?.data?.content?.type as string;
      let nowType = content?.type as string;

      console.log("nowType:", nowType);
      //card id
      //dccap
      let nTaskid = taskData.id.id;
      let nowDC = stringArrayDC.find((dc:any) => dc.taskid === nTaskid);
      //console.log("nowDC", nowDC);
      let nowCreatorCap = nowDC.id.id;
      console.log("nowCreatorCap", nowCreatorCap);

      //bagcap
      let BagCountid = localStorage.getItem("BagCountid") as string;
      console.log("BagCountid", BagCountid);
      
      //taskid
      console.log("detaskid:", nTaskid);

      //user address
      console.log("handleItemSend user address:",item);

      let txb = new TransactionBlock();
      txb.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::${USERTAKE_FUNCTION_NAME}`,
        arguments: [
          txb.gas,
          txb.object(nowCardid),
          txb.object(nowCreatorCap),
          txb.object(BagCountid),
          txb.object(nTaskid),
          txb.object(item),
        ],
        typeArguments: [
          nowType,
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
            console.log("Sendtosender success");
            console.log(data);
            alert("Sendtosender success");
            // await refetchEvents();
            // await refetchDeTaskList();
            await refetchQuery();
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
            console.log("Sendtosender error");
            alert("Sendtosender error");
            // enqueueSnackbar(String(error), {
            //   variant: "error",
            // });
            // setIsClaiming({ ...isClaiming, [redPacket.id.id]: false });
          },
        }
      );
    };

    const isShow = (item:string):boolean => {
      let nowitem = multiTakerItem?.find( (dc:any) =>(
        dc.data.content.fields.name == item) as any
      );
      console.log("nowitem :", item);
      console.log("nowitem finded:", nowitem);
      let connetfileds = nowitem?.data?.content as any;
      if(connetfileds)
        if(connetfileds.fileds?.value?.fields?.tst == '4'){
          return false;
        }
      return true;
    }
  
    return (
      <div>
        <div>
          {/* 创建按钮 */}
          <CreateDetask refetchDeTaskList={refetchEvents} currentlang={currentlang}/>
  
        </div>
        {
          deTaskList?.map((item,index) => (
            <div key={index} className="tasklistitem" onClick={() => handleItemClick(item)}>
              <TaskList
                taskData={item}
              />
            </div>
          ))
        }
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
            <textarea className="describe" value={taskData.describe} readOnly>              
            </textarea>
  
            <p>邮箱 : {taskData.email}</p>
            <p>其他 :
              {
                isPngImageUrl(taskData.ext) ?
                  (<img src={taskData.ext} alt="图片" />) :
                  (taskData.ext)
              }
            </p>
            <div>
            <div>赠品列表</div>
            {
              multiItem?.map((item ,index) => (
                <div key={index} className="itemlistitem">
                <input type="radio" id={`op-${index}`} className="optradio" 
                checked={selectedItemId === index}
                onChange={() => handleItemClickCardList(index)} />
                <MoveDisplay content={item.data?.content}></MoveDisplay>

                 <span>
                  {
                    isTaskCreator &&  (
                      <button className="itemback" onClick={()=>handleItemBack(index)}>撤回</button>
                    )
                  }
                  
                 </span>
                </div>

              ))
            }
            </div>
            <div>
              <div>接取人列表</div>
              {
                taskData.taker_addresses?.map((item,index) => (
                  <div key={index} className="itemlistitem">
                    <LowString text={item} />
                    <span>
                    {
                    isTaskCreator &&  (
                      isShow(item) ? (
                        <button className="sendto" onClick={()=>handleItemSend(item)}>赠送</button>
                      ):(
                        <span className="havesend">已送</span>
                      )
                    )
                    }
                    {/* <SendToButton taskNow={taskData} /> */}
                    </span>
                  </div>

                ))
              }

            </div>
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
      </div>
    );
  }
  