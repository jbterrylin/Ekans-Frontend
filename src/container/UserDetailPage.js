import React, { useState, useEffect } from 'react';
import { 
    PageHeader, 
    Descriptions,
    Button,
    notification,
    Form,
    Input,
    Result,
    Spin,
    message,
    DatePicker,
    Collapse,
    List
} from 'antd';
import { ExclamationCircleOutlined, UserOutlined, CaretRightOutlined } from '@ant-design/icons';
import MainStructure from '../component/MainStructure';
import LAvatar from '../component/LAvatar';
import { useParams } from 'react-router-dom';
import request from '../utils/apisauce';
import checkjob from '../utils/checkjob';
import moment from 'moment';
import { Link } from "react-router-dom";
import messagefunction from '../utils/messagefunction';

const { TextArea } = Input;
const { Panel } = Collapse;

function UserDetailPage(props) {
    const { ID } = useParams();
    const [data, setData] = useState(null);
    const [reportData, setReportData] = useState(null);
    const [reportDate, setReportDate] = useState(null);
    const [responseStatus, setResponseStatus] = useState(true);

    useEffect(() => {
        const action = async function() {
            const requestVar = {
                ID: ID ? ID : JSON.parse( localStorage.getItem("userData") ).ID,
                DateTime: moment(localStorage.getItem('fakelocaltime').split('JBTERRYLIN')[0]).format(),
            };
        
            var calanderData = await request("GET", `Calander`, requestVar);
            if(calanderData.Ok) {
                setReportData(calanderData.Result);
                setReportDate(moment(localStorage.getItem('fakelocaltime').split('JBTERRYLIN')[0]));
            }
        };
        action();
    },[ID]);

    useEffect(() => {
        const action = async function() {
            var response = await request("GET", `User/${checkjob(["Admin","Manager"]) ? ID : JSON.parse( localStorage.getItem("userData") ).ID}`);
            if(response.Ok) {
                response = response.Result.result;
                setData(response);
            } else {
                setResponseStatus(false);
            }
        };
        action();
    },[ID]);

    const pageHeader = () => {
        return (
          <PageHeader
            title={`${data ? data.Name : "Nameless"}'s Detail`}
            style={{ border: "1px solid rgb(235, 237, 240)", borderLeft: "0px" }}
            extra={[
                (checkjob(["Admin"]) &&
                data.Job === "Manager") ||
                (checkjob(["Manager"]) &&
                (data.Job === "Nurse" || data.Job === "PTNurse")) ?
                    <Button key="1" type="primary">
                        <Link to={`/useredit/${ID}`}>Edit User</Link>
                    </Button>
                :
                    null
            ]} 
          />
        );
    }

    const onFinish = async (values) => {
        var temp = data;
        temp.ResignDateTime = moment().format();
        temp.ResignReason = values.ResignReason;
        temp.IsResign = true;
        const response = await request("PUT", `User/${data.ID}`, temp);
       
        message.success('Success');
        notification.close("deleteNotification");
        
        setData(response.Result.result);
    }

    const btn = (
        <Form
            onFinish={onFinish}
        >
            <Form.Item
                name="ResignReason"
            >
                <TextArea
                    rows={4}
                    placeholder="Here may input reason of resign. It may be empty."
                />
            </Form.Item>
            <Form.Item
                name="ResignReason"
            >
                <Button 
                    type="primary" 
                    size="small" 
                    htmlType="submit"
                    style={{ float: "right" }}
                >
                    Confirm
                </Button>
            </Form.Item>
        </Form>
    )

    const deleteNotification = () => {
        notification.open({
            key: "deleteNotification",
            duration: 0,
            message: 'Are you sure want to resign?',
            description:
            `Are you sure want to resign ${data.Name}? If wrong click just close it.`,
            icon: <ExclamationCircleOutlined style={{ color: '#108ee9' }} />,
            btn,
        });
    };

    const descriptions = () => {
        return(
            <div style={{ marginTop: "32px", textAlign: "-webkit-center" }}>
                <div style={{ margin: "16px" }}>
                    <LAvatar 
                        condition = {data.Picture !== ""}
                        icon = {{condition: false, icon: <UserOutlined />}}
                        src={{condition: true, src: data.Picture}} 
                        size={256}
                        shape="square"
                    />
                    <Descriptions title={data.Name + " Info"} bordered>
                        <Descriptions.Item label="ID" span={2}>{data.ID}</Descriptions.Item>
                        <Descriptions.Item label="Job">{data.Job}</Descriptions.Item>
                        <Descriptions.Item label="Name" span={2}>{data.Name}</Descriptions.Item>
                        <Descriptions.Item label="Phone Number">{data.PhoneNumber}</Descriptions.Item>
                        <Descriptions.Item label="Register Time" span={data.IsResign ? 2 : 1}>{data.RegisterDateTime}</Descriptions.Item>
                        {
                            data.IsResign ?
                                <Descriptions.Item label="Resign Time">{data.ResignDateTime}</Descriptions.Item>
                            :
                                null
                        }
                        {
                            data.IsResign ?
                                <Descriptions.Item label="Resign Reason" span={2}>
                                    {
                                        data.ResignReason === "" ?
                                            "-" 
                                        : 
                                            data.ResignReason
                                    }
                                </Descriptions.Item>
                            :
                                null
                        }
                    </Descriptions>
                    {
                        !data.IsResign ?
                            (checkjob(["Admin"]) &&
                            data.Job === "Manager") ||
                            (checkjob(["Manager"]) &&
                            (data.Job === "Nurse" || data.Job === "PTNurse")) ?
                                <Button 
                                    type="primary" 
                                    block
                                    style={{ marginTop: "16px" }}
                                    onClick={() => deleteNotification()}
                                >
                                    Resign
                                </Button>
                            :
                                null
                        :
                            null
                    }
                </div>
            </div>
        );
    }

    const onChange = async(values) => {
        messagefunction("Loading");
        const requestVar = {
            ID: ID ? ID : JSON.parse( localStorage.getItem("userData") ).ID,
            DateTime: values.format(),
        };
    
        var calanderData = await request("GET", `Calander`, requestVar);
        if(calanderData.Ok) {
            setReportData(calanderData.Result);
            setReportDate(values);
        }
        messagefunction("Kill");
        messagefunction("Success");
    }

    const collapse = (headerNumber, situationString) => {
        return (
            <Collapse ghost expandIconPosition="right" expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 180} />}>
                <Panel header={headerNumber}>
                    <List
                        dataSource={reportData.DayList ? reportData.DayList : []}
                        renderItem={item => 
                            item.Matter &&
                            item.Matter.map((value) => 
                                value.Situation === situationString ?
                                    <List.Item>
                                        <Link to={`/rosterlist/${reportDate.year()}-${reportDate.month() < 10 ? "0" : ""}${reportDate.month()+1}-${item.Number < 10 ? "0" : ""}${item.Number}/${value.Area}/${value.Shift}`}>
                                            {`${reportDate.year()}-${reportDate.month()+1}-${item.Number} ${value.Shift}`}
                                        </Link>
                                    </List.Item>
                                :
                                    null
                            )
                        }
                    />
                </Panel>
            </Collapse>
        );
    }

    const report = () => {
        return (
            <div style={{ marginTop: "32px", textAlign: "-webkit-center" }}>
                <div style={{ margin: "16px" }}>
                    <Descriptions title={"Report"} bordered layout="vertical">
                            <Descriptions.Item label="Date" span={2}>
                                <DatePicker onChange={onChange} allowClear={false} picker="month" defaultValue={moment(localStorage.getItem('fakelocaltime').split('JBTERRYLIN')[0])} />
                            </Descriptions.Item>
                            <Descriptions.Item label="Total Shift" span={2}>
                                {reportData.Meta.Total}
                            </Descriptions.Item>
                            <Descriptions.Item label="Total Attend Shift" span={8}>
                                {collapse(reportData.Meta.Attend, "Attend")}
                            </Descriptions.Item>
                            <Descriptions.Item label="Total Annual Leave" span={8}>
                                {collapse(reportData.Meta.AnnualLeave, "Annual Leave")}
                            </Descriptions.Item>
                            <Descriptions.Item label="Total MC" span={8}>
                                {collapse(reportData.Meta.MC, "MC")}
                            </Descriptions.Item>
                    </Descriptions>
                </div>
            </div>
        );
    }

    return (
        <MainStructure
            content = {
                <div style={{ height: "100%", position: "relative" }}>
                    {
                        data && responseStatus ?
                            pageHeader()
                        :
                            null
                    }
                    {
                        data && responseStatus ?
                            descriptions()
                        :
                            responseStatus ?
                                <Spin 
                                    style={{ margin: "0",
                                        position: "absolute",
                                        top: "50%",
                                        left: "50%",
                                        transform: "translate(-50%, -50%)",
                                    }} 
                                />
                            :
                                <Result
                                    status="404"
                                    title="404"
                                    subTitle="Sorry, the page you visited does not exist."
                                />
                    }
                    {
                        reportData && (checkjob(["Manager"]) || ID === JSON.parse( localStorage.getItem("userData") ).ID) &&
                        data && (data.Job === "Nurse" || data.Job === "PTNurse") ?
                            report()
                        :
                            null
                    }
                </div>
            }
        />
    );
}

export default UserDetailPage;