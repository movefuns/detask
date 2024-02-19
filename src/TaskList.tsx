import './Card.css'; 
// import {
//     SUI_CLOCK_OBJECT_ID,
//     SUI_DECIMALS,
//     SUI_TYPE_ARG,
// } from "@mysten/sui.js/utils";

import {
    useCurrentAccount,
} from "@mysten/dapp-kit";

interface taskProps {
    taskData: any;
}

// @ts-ignore
const TaskList: React.FC<taskProps> = ({ taskData}) => {
    console.log("taskData:",taskData);

    const nowreward = Number(taskData.reward) / 1000000000;
    
    const currentAccount = useCurrentAccount();

    const isInArray = taskData.taker_addresses.includes(currentAccount!.address);

    function formatDate(date : any) {  
      const year = date.getFullYear();  
      const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以需要+1  
      const day = String(date.getDate()).padStart(2, '0');  
      
      return `${year} | ${month} | ${day}`;  
    }  
    const startDate = formatDate(new Date(Number(taskData.st_timestamp_ms)));
    const formattedDate = startDate;  

    return (
      <div className="card">
        <div className="card-details">
          {/* <p className="card-name">Card Name: {cardName}</p>
          <p>HP: {hp}</p>
          <p>LV: {lv}</p>
          <p>Attack: {attack}</p> */}
          {/* taskData.map((task: any) => {

          }); */}
        <p>{isInArray &&(<span className='haveget'>已接取</span>)}</p>
        
        {
          "MOVEQ" == taskData.inscription ? (
            <>
            <p>悬赏任务 : {taskData.deName} 开始时间:{formattedDate}</p>
            <p>MOVE数量:{taskData.baglist.fields.size}</p>
            <p>奖励 : MOVE </p>
            </>
          ):(
          "COUPON" == taskData.inscription ?
          (
            <>
            <p>活动名 : {taskData.deName} 开始时间:{taskData.startDate}</p>
            <p>优惠券 : {taskData.inscription}</p>
            <p>价值 : ￥{nowreward} </p>
            </>
          ):(
            <>
              <p>任务名 : {taskData.deName} 开始时间:{formattedDate}</p>
              <p>铭文 : {taskData.inscription}</p>
              <p>完成奖励 : {nowreward} SUI</p>
            </>
          )
          )
        }
        
        <p>完成进度 : {taskData.tcount - taskData.left_tcount} / {taskData.tcount}</p>
        </div>

        
        
      </div>
    );
  };
  
  export default TaskList;