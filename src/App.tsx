import {
    useCurrentAccount, useSuiClientQuery,
    useSuiClientQueries,
    useSuiClientInfiniteQuery,
    useSignAndExecuteTransactionBlock,
} from "@mysten/dapp-kit";
import { useSuiClientContext, ConnectButton } from "@mysten/dapp-kit";
import { Box, Container, Flex, Heading } from "@radix-ui/themes";
import { WalletStatus } from "./WalletStatus";
import { NetworkSelector } from "./NetworkSelector";
import { useState } from "react";
import './app.css'
import './app/globals.css'

import  lang from './tools/lang.json';
import  Demoshow  from './demoshow';
import  FirstPage from "./components/component/first-page";


interface Props {
    useNetworkVariable: any; // 根据 useNetworkVariable 的类型进行定义
}

// 定义一个 App 组件，并使用 useNetworkVariable 进行网络变量获取
const App: React.FC<Props> = ({ useNetworkVariable }) => {
//const App = () => {
    const [showDialog, setShowDialog] = useState(false);
    const [showText, setShowText] = useState("");
    const nowid = useNetworkVariable("myMovePackageId");
    //const nowid = '0x90e99e07df3c492186e4d67ba8b8c0f6e35b4f4e48ed864ea392a8895f4c5a3f';

    const [currentLanguage, setCurrentLanguage] = useState('en');
    const changeLanguage = (language: string) => {
        setCurrentLanguage(language);
    };

    const nLang = lang as any;

    const InstructionsText = `
    Instructions for using the DeTask - FindWork website

    Introduction:
    DeTask is a platform where users can post tasks and find job opportunities or promotional activities.
    This instruction will provide guidance on how to effectively use DeTask, including instructions for both tasks and task publishers and recipients.

    Task type:
    Currently divided into events and coupon promotion

    Task publisher:
    When publishing a task, click the "Create Detask" button and fill in the necessary information, such as task details and reward rules.
    Provide clear and concise guidance to ensure that the task receiver understands the task requirements.
    Specify the reward amount or task completion rule.

    Task receiver:
    Browse all available tasks on the website.
    Before deciding whether to accept a task, carefully read and understand the task details and rules.
    If interested, click on the task to accept and start executing the task.

    Communication:
    The task issuer and the task receiver communicate through external communication tools such as WeChat, Gmail, or other preferred communication platforms.
    Communication is essential to confirm task completion and discuss any additional requirements.
    The task issuer may require the task receiver to provide screenshots or other necessary information for verification and reward payment.
    Both parties should agree on communication channels and maintain effective communication during the completion of tasks.

    DeTask website features:
    DeTask is mainly used as a platform for task publishing and displaying task information.
    The task receiver can easily access and accept tasks through the website, but all other communication and coordination are conducted outside the platform.
    The website does not provide direct communication between task publishers and task receivers, and users need to choose and maintain their own communication channels.

    Cost:
    The task publisher needs to pay a fee of 0.1 SUI to publish the task.
    The task receiver does not need to pay any fees when accepting the task, but the on-chain transaction fees incurred during the completion of the task need to be paid by the receiver.
    Note: Both the task publisher and the task receiver should read and understand the terms and conditions for using DeTask, and follow any guidelines provided on the website to ensure a smooth and successful task completion process.

    We hope that this instruction manual can help you effectively use DeTask - FindWork. If you have any further questions or need assistance, please feel free to contact us.

    `;

    const InstructionsTextCN = `
    DeTask - FindWork 网站使用说明

    简介：
    DeTask 是一个平台，用户可以发布任务并找到工作机会或优惠活动。
    本使用说明将提供关于如何有效使用 DeTask 的指南，包括任务以及任务发布者和接任务者两方面的操作说明。
    
    任务种类:
    目前分为 活动 和 优惠券推广
    
    任务发布者：
    发布任务时，点击“Create Detask”按钮，并填写必要的信息，如任务详情和奖励规则。
    提供清晰简明的指导，确保接任务者理解任务要求。
    指定奖励金额或任务完成规则。
    
    接任务者：
    浏览网站上的所有可用任务。
    在决定是否接受任务之前，仔细阅读和理解任务详情和规则。
    如果感兴趣，点击任务接受并开始执行任务。
    
    沟通：
    任务发布者和接任务者通过外部通讯工具（如微信、Gmail 或其他偏好的沟通平台）进行沟通。
    沟通对于确认任务完成和讨论任何额外要求至关重要。
    任务发布者可能要求接任务者提供完成截图或其他必要信息以进行验证和奖励支付。
    双方应就沟通渠道达成一致，并在任务完成过程中保持有效的沟通。
    
    DeTask 网站功能：
    DeTask 主要作为任务发布和展示任务信息的平台。
    接任务者可以通过网站方便地访问并接受任务，但所有其他的沟通和协调都是在平台外进行。
    网站不提供任务发布者和接任务者之间的直接沟通，用户需自行选择和维护沟通渠道。
    
    费用：
    任务发布者需要支付 0.1 个 SUI 的费用来发布任务。
    接任务者接受任务时无需支付任何费用，但在任务完成过程中产生的链上交易费用需要自行支付。
    注意：任务发布者和接任务者都应阅读并理解使用 DeTask 的条款和条件，并遵循网站上提供的任何指南，以确保任务完成过程顺利成功。
    
    希望本使用说明能帮助您有效地使用 DeTask - FindWork。如果您有任何进一步的问题或需要帮助，请随时联系我们。
    
    `;

    const InstructionsTextGr = `
    Anleitung für die Nutzung der DeTask - FindWork Website

    Einführung:
    DeTask ist eine Plattform, auf der Benutzer Aufgaben veröffentlichen und Arbeitsmöglichkeiten oder Werbeaktionen finden können.
    Diese Anleitung bietet einen Leitfaden zum effektiven Einsatz von DeTask, einschließlich Erläuterungen zu Aufgaben sowie zur Handhabung für Aufgabenveröffentlicher und -erfüller.

    Aufgabentypen:
    Derzeit unterteilt in Aktivitäten und Gutscheinwerbung.

    Aufgabenveröffentlicher:
    Beim Veröffentlichen einer Aufgabe klicken Sie auf die Schaltfläche "Create Detask" und füllen die notwendigen Informationen aus, wie Aufgabendetails und Belohnungsregeln.
    Stellen Sie klare und prägnante Anleitungen bereit, um sicherzustellen, dass die Aufgabenerfüller die Anforderungen verstehen.
    Bestimmen Sie Belohnungsbetrag oder Regeln zur Aufgabenerledigung.

    Aufgabenerfüller:
    Durchsuchen Sie alle verfügbaren Aufgaben auf der Website.
    Lesen und verstehen Sie sorgfältig die Aufgabendetails und -regeln, bevor Sie entscheiden, ob Sie eine Aufgabe annehmen.
    Wenn Sie interessiert sind, klicken Sie auf Aufgabe akzeptieren und beginnen Sie mit der Erfüllung.

    Kommunikation:
    Aufgabenveröffentlicher und -erfüller kommunizieren über externe Kommunikationstools wie WeChat, Gmail oder andere bevorzugte Kommunikationsplattformen.
    Kommunikation ist entscheidend für die Bestätigung der Aufgabenerledigung und die Diskussion etwaiger zusätzlicher Anforderungen.
    Der Aufgabenveröffentlicher kann vom Aufgabenerfüller einen Abschlussscreenshot oder andere notwendige Informationen zur Überprüfung und Belohnungszahlung verlangen.
    Beide Parteien sollten über den Kommunikationskanal einig sein und während des Aufgabenerledigungsprozesses effektiv kommunizieren.

    DeTask-Websitefunktionen:
    DeTask dient hauptsächlich als Plattform für die Veröffentlichung von Aufgaben und die Darstellung von Aufgabeninformationen.
    Aufgabenerfüller können über die Website komfortabel auf Aufgaben zugreifen und diese akzeptieren, aber alle anderen Kommunikationen und Koordinierungen erfolgen außerhalb der Plattform.
    Die Website bietet keine direkte Kommunikation zwischen Aufgabenveröffentlichern und -erfüllern; Benutzer müssen Kommunikationskanäle selbst auswählen und pflegen.

    Kosten:
    Der Aufgabenveröffentlicher muss eine Gebühr von 0,1 SUI zahlen, um eine Aufgabe zu veröffentlichen.
    Der Aufgabenerfüller zahlt beim Akzeptieren einer Aufgabe keine Gebühren, muss aber selbst für etwaig entstandene Transaktionsgebühren auf der Blockchain aufkommen.
    Hinweis: Sowohl Aufgabenveröffentlicher als auch -erfüller sollten die Nutzungsbedingungen von DeTask lesen und verstehen sowie alle auf der Website bereitgestellten Leitlinien befolgen, um sicherzustellen, dass der Aufgabenerledigungsprozess reibungslos verläuft.

    Wir hoffen, dass diese Anleitung Ihnen helfen wird, DeTask - FindWork effektiv zu nutzen. Wenn Sie weitere Fragen haben oder Hilfe benötigen, kontaktieren Sie uns bitte jederzeit.
    `;

  const AnnouncementText = `
  
    尊敬的各位用户：

    您好！

    为了保证平台信息的准确性和有效性，提升用户体验，我们特此制定以下规定：

    自即日起，对于所有未发布具体任务内容或内容详情不全的任务，系统将在每日晚上0点自动进行屏蔽处理。我们鼓励用户在发布任务时，提供详尽、清晰的任务描述和要求，以便其他用户能够准确理解并参与其中。

    此举旨在维护一个健康、高效的任务交流环境，确保每位用户都能获得有价值的信息和体验。请大家在发布任务时务必注意内容的完整性和准确性，共同维护良好的平台秩序。

    感谢您的理解与支持！如有任何疑问或建议，请随时联系我们的客服团队。

    祝您使用愉快！

    网站管理团队

  `;

    // console.log(nowid);
    let isPackaged = true;
    const isNetFixTime = false; //维护时刻 true
    const detaskVersion = 1;

    const handleOpenDialog = (sel : number) => {
        console.log(sel);

        if( currentLanguage == 'en')
            setShowText(InstructionsText);
        if( currentLanguage == 'zh')
            setShowText(InstructionsTextCN);
        setShowDialog(true);
    };
    const handleCloseDialog = () => {
        setShowDialog(false);
    };

    localStorage.setItem("packageId", nowid);
    if (process.env.NODE_ENV === 'development') {
        // 开发环境下的逻辑
        console.log('当前是开发环境');
        // setPackaged(false);
        isPackaged = true;
    } else if (process.env.NODE_ENV === 'production') {
        // 生产/打包环境下的逻辑
        isPackaged = false;
        console.log('当前是打包环境');
    } else {
        // 其他环境下的逻辑
        console.log('当前是其他环境');
    }

    // const account = useCurrentAccount();

    return (
        <div className="appbody">
            <Flex
                position="sticky"
                px="4"
                py="2"
                justify="between"
                style={{
                    borderBottom: "1px solid var(--gray-a2)",
                }}
            >
                <Box>
                    <Heading>
                        {nLang[currentLanguage].logo}

                        <button className="lanButton" onClick={() => changeLanguage('en')}>EN</button>
                        <button className="lanButton" onClick={() => changeLanguage('zh')}>中文</button>

                        <button className="appbutton" onClick={() => handleOpenDialog(1)}>
                        {nLang[currentLanguage].info}
                        </button>
                        {/* <button className="appbutton" onClick={() => handleOpenDialog(2)}>
                            使用说明
                        </button> */}
                        {/* <button className="appbutton" onClick={() => handleOpenDialog(3)}>
                            Gebrauchsanweisungen
                        </button> */}
                        {/* <button className="appbutton" onClick={() => handleOpenDialog(4)}>
                        {nLang[currentLanguage].info2}
                        </button> */}
                    </Heading>
                    {showDialog && (
                        <div className="dialog">
                            <div style={{ position: 'fixed', top: '0%', left: '40%', transform: 'translateX(-50%)', border: '1px solid black', padding: '20px', backgroundColor: 'black' }}>
                                <button className="btclose" onClick={() => handleCloseDialog()}>关闭</button>
                                <textarea className="userGuide" readOnly
                                value={showText}
                                />

                            </div>
                        </div>
                    )}
                    {isPackaged && (
                        <NetworkSelector />
                    )}
                </Box>

                <Box>
                    <ConnectButton />
                </Box>
            </Flex>
            <Container>
                <Container
                    mt="5"
                    pt="2"
                    px="4"
                    style={{ background: "var(--gray-a2)", minHeight: 500 }}
                >
                {
                    true == isNetFixTime as boolean ? (
                        <Heading>
                            维护中... 请稍后再来 <br />
                            Website maintenance in progress
                        </Heading>
                    ):(
                        <WalletStatus currentlang={currentLanguage} />
                        // <Demoshow showData = {account?.address} />
                        // <></>
                    )
                }
                </Container>
            </Container>
            <FirstPage />
        </div>
    );
}

export default App;
