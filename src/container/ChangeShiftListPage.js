import React, { useState, useEffect } from 'react';
import { 
  PageHeader,
  Collapse, 
  Divider, 
  Col, 
  Row,
  Card, 
  Button,
  Spin
} from 'antd';
import { 
    CheckOutlined,
    CloseOutlined
} from '@ant-design/icons';
import MainStructure from '../component/MainStructure';
import {
    Link
} from "react-router-dom";
import moment from 'moment';
import request from '../utils/apisauce';

const { Panel } = Collapse;

function ChangeShiftListPage() {
    const [data, setData] = useState(null);
    const [userList, setUserList] = useState(null);
    const [areaList, setAreaList] = useState(null);

    useEffect(() => {
        const action = async function() {
            // const requestVar = {
            //     ID: JSON.parse( localStorage.getItem("userData") ).ID,
            // };
        
            var shiftRequestList = await request("GET", `/ShiftRequest`);
            if(shiftRequestList.Ok) {
                setData(shiftRequestList.Result.result);
            }
            
            var userList = await request("GET", `/User`);
            console.log(userList.Result.result);
            if(userList.Ok) {
                setUserList(userList.Result.result);
            }

            var response = await request("GET", "Area");
            if(response.Ok) {
                setAreaList(response.Result.result);
            }
        };
        action();
    },[]);  

    const getData = async() => {
        var shiftRequestList = await request("GET", `/ShiftRequest`);
        if(shiftRequestList.Ok) {
            setData(shiftRequestList.Result.result);
        }
    }

    const pageHeader = () => {
        return (
            <PageHeader
                title="Change Shift"
                style={{ border: "1px solid rgb(235, 237, 240)", borderLeft: "0px" }}
                extra={[
                    <Button key="1" type="primary">
                        <Link to="/changeshiftadd">Send Request</Link>
                    </Button>,
                ]}
            />
        );
    }

    const yesNoUpdate = async(yesNo,value) => {
        const temp = value;
        temp.Status = yesNo;
        temp.$StatusUpdate = true;
        temp.DecideDateTime = moment(localStorage.getItem('fakelocaltime').split('JBTERRYLIN')[0]).format();
        const temp3 = await request("PUT", `/ShiftRequest/${temp.ID}`, temp);
        console.log(temp3);
        getData();
    }

    const dividerString = ["Request from other", "Request to other"];

    const content = () => {
        return (
            <div>
                {
                    dividerString.map((string, index) => 
                        <Collapse ghost defaultActiveKey={Array.from(Array(4).keys())} key={index}>
                            <Panel 
                                header={
                                    <Divider orientation="left">
                                        {string}
                                    </Divider>
                                }
                                key={index}
                            >
                                <div 
                                    style={{ textAlign: "-webkit-center" }}
                                >
                                    <Row gutter={16} justify="start" align="middle">
                                        {
                                            data &&
                                            data.map((value, index1) => 
                                                ((value.RequesteeID === JSON.parse( localStorage.getItem("userData") ).ID && index === 0) ||
                                                (value.RequesterID === JSON.parse( localStorage.getItem("userData") ).ID && index === 1)) &&
                                                !(value.Status !== "Pending" && moment(localStorage.getItem('fakelocaltime').split('JBTERRYLIN')[0]).subtract(3,'days').isAfter(moment(value.DecideDateTime))) ?
                                                    <Col
                                                        key={`${index} ${index1}`}
                                                        span={12}
                                                        style={{
                                                            marginBottom: "16px"
                                                        }}
                                                    >
                                                        <Card 
                                                            title={
                                                                `${index === 0 ? "From" : "to"}: ${
                                                                    value.RequesterID === JSON.parse( localStorage.getItem("userData") ).ID ? 
                                                                        userList.find(val => parseInt(val.ID) === parseInt(value.RequesteeID)).Name
                                                                    : 
                                                                        userList.find(val => parseInt(val.ID) === parseInt(value.RequesterID)).Name
                                                                    }`
                                                                } 
                                                            // title={`${index === 0 ? "From" : "to"}:${value.RequesterID === JSON.parse( localStorage.getItem("userData") ).ID ? value.RequesteeID : value.RequesterID}`}
                                                            bordered={false} 
                                                            style={{ 
                                                                width: "26rem",
                                                                textAlign: "-webkit-left",
                                                                border: "1px solid rgb(235, 237, 240)"
                                                            }}
                                                            extra={index === 1 && value.Status === "Pending" ? <Link to={`/changeshiftedit/${value.ID}`}>Edit</Link> : null}
                                                            actions={
                                                                index === 0 ?
                                                                    value.Status === "Pending" ?
                                                                        [
                                                                            <CloseOutlined 
                                                                                key="no" 
                                                                                onClick={() => yesNoUpdate("Reject",value) }
                                                                            />,
                                                                            <CheckOutlined 
                                                                                key="yes" 
                                                                                onClick={() => yesNoUpdate("Accept",value) }
                                                                            />
                                                                        ]
                                                                    :
                                                                        [value.Status]
                                                                :
                                                                    [value.Status]
                                                            }
                                                        >
                                                            After change<br />
                                                            You: {
                                                                value.RequesterID === JSON.parse( localStorage.getItem("userData") ).ID ? 
                                                                    `${moment(value.RequesteeDateTime).format("YYYY-MM-DD")} ${areaList ? areaList.find(val => parseInt(val.ID) === parseInt(value.RequesteeArea)).AreaName : "Unknown"} ${value.RequesteeShift}` 
                                                                : 
                                                                    `${moment(value.RequesterDateTime).format("YYYY-MM-DD")} ${areaList ? areaList.find(val => parseInt(val.ID) === parseInt(value.RequesterArea)).AreaName : "Unknown"} ${value.RequesterShift}` 
                                                                }<br />
                                                            Requester:{
                                                                value.RequesterID === JSON.parse( localStorage.getItem("userData") ).ID ? 
                                                                    `${moment(value.RequesterDateTime).format("YYYY-MM-DD")} ${areaList ? areaList.find(val => parseInt(val.ID) === parseInt(value.RequesterArea)).AreaName : "Unknown"} ${value.RequesterShift}` 
                                                                :
                                                                    `${moment(value.RequesteeDateTime).format("YYYY-MM-DD")} ${areaList ? areaList.find(val => parseInt(val.ID) === parseInt(value.RequesteeArea)).AreaName : "Unknown"} ${value.RequesteeShift}` 
                                                                }<br />
                                                            Remark: {value.Remark}<br />
                                                        </Card>
                                                    </Col>
                                                :
                                                    null
                                            )
                                        }
                                    </Row>
                                </div>  
                            </Panel>
                        </Collapse>
                    )
                }
            </div>
        );
    }

    return (
        <MainStructure
            content = {
                data && areaList && userList ?
                    <div>
                        {pageHeader()}
                        {content()}
                    </div>
                :
                    <div style={{ height: "100%", position: "relative" }}>
                        <Spin 
                            style={{ margin: "0",
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                            }} 
                        />
                    </div>
            }
        />
    );
}

export default ChangeShiftListPage; 
