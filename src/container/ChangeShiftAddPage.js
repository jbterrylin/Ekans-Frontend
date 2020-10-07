import React, { useState, useEffect, useRef } from 'react';
import { 
    PageHeader,
    Button,
    Form, 
    Input, 
    Select,
    DatePicker,
    Alert,
    Spin
} from 'antd';
import { 
} from '@ant-design/icons';
import MainStructure from '../component/MainStructure';
// import {
//     Link
// } from "react-router-dom";
import moment from 'moment';
import request from '../utils/apisauce';
import messagefunction from '../utils/messagefunction';
import{ useHistory, useParams } from 'react-router-dom';

const { TextArea } = Input;
const { Option } = Select;

function ChangeShiftListPage() {
    const formRef = useRef();
    const router = useHistory();
    const { ID } = useParams();
    const pageName = router.location.pathname.indexOf("/changeshiftadd") !== -1 ? "changeshiftadd" : "changeshiftedit";
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState(null);
    const [areaList, setAreaList] = useState(null);

    const [requesterData, setRequesterData] = useState(null);
    const [requesterArea, setRequesterArea] = useState(null);

    const [requesteeID, setRequesteeID] = useState(null);
    const [requesteeData, setRequesteeData] = useState(null);
    const [requesteeArea, setRequesteeArea] = useState(null);

    const getRequesteeData = async(value) => {
        const requestVar = {
            ID: requesteeID,
            DateTime: moment(value.format("YYYY-MM-DD")).format(),
            ForExchange: true,
        };
        var requesteeCalander = await request("GET", `Calander`, requestVar);
        console.log(requesteeCalander.Result.DayList);
        if(requesteeCalander.Ok) {
            setRequesteeData(requesteeCalander.Result.DayList);
        }
    }

    useEffect(() => {
        const action = async function() {
            var response = await request("GET", "Area");
            if(response.Ok) {
                setAreaList(response.Result.result);
            }
        }
        action();
    },[]);

    useEffect(() => {
        const action = async function() {
            var temp = await request("GET", `User?$Now=true&$JobCategory=('Nurse')`);
            if(temp.Ok) {
                temp = await request("GET", `User?$Now=true&$JobCategory=('Nurse')&limit=${temp.Result.meta.total ? temp.Result.meta.total : 10}`);
                setUserData(temp.Result.result);
            }

            if(pageName === "changeshiftedit") {
                var ShiftRequestData = await request("GET", `ShiftRequest/${ID}`);
                ShiftRequestData = ShiftRequestData.Result.result;
                formRef.current.setFieldsValue({
                    RequesterDateTime: moment(ShiftRequestData.RequesterDateTime),
                    RequesterShift: ShiftRequestData.RequesterShift,
                    RequesterArea: ShiftRequestData.RequesterArea,
                    RequesteeID: ShiftRequestData.RequesteeID,
                    RequesteeDateTime: moment(ShiftRequestData.RequesteeDateTime),
                    RequesteeShift: ShiftRequestData.RequesteeShift,
                    RequesteeArea: ShiftRequestData.RequesteeArea,
                    Remark: ShiftRequestData.Remark,
                });
                setRequesterArea(ShiftRequestData.RequesterArea);
                setRequesteeArea(ShiftRequestData.RequesteeArea);
                setRequesteeID(ShiftRequestData.RequesteeID);
                const requestVar = {
                    ID: requesteeID,
                    DateTime: moment(ShiftRequestData.RequesteeDateTime).format(),
                    ForExchange: true,
                };
            
                var temp4 = await request("GET", `Calander`, requestVar);
                if(temp4.Ok) {
                    setRequesteeData(temp4.Result.DayList);
                }
                setRequesteeArea(ShiftRequestData.RequesteeArea);
            }
            const requestVar = {
                ID: JSON.parse( localStorage.getItem("userData") ).ID,
                DateTime: pageName === "changeshiftedit" ? moment(ShiftRequestData.RequesterDateTime).format() : moment(localStorage.getItem('fakelocaltime').split('JBTERRYLIN')[0]).format(),
                ForExchange: true,
            };
            
            var requesterCalander = await request("GET", `Calander`, requestVar);
            if(requesterCalander.Ok) {
                setRequesterData(requesterCalander.Result.DayList);
            }
        };
        action();
    },[ID, pageName, requesteeID]);  

    const getData = async(value) => {
        const requestVar = {
            ID: JSON.parse( localStorage.getItem("userData") ).ID,
            DateTime: moment(value.format("YYYY-MM-DD")).format(),
            ForExchange: true,
        };
    
        var requesterCalander = await request("GET", `Calander`, requestVar);
        console.log(requestVar);
        console.log(requesterCalander);
        if(requesterCalander.Ok) {
            setRequesterData(requesterCalander.Result.DayList);
        }
    }

    const pageHeader = () => {
        return (
            <PageHeader
                title={`${pageName === "changeshiftadd" ? "Add" : "Edit"} Change Shift`}
                style={{ border: "1px solid rgb(235, 237, 240)", borderLeft: "0px" }}
                extra={[
                    pageName === "changeshiftedit" ?
                      <Button 
                        key="1"
                        danger 
                        type="primary" 
                        onClick={async() => {
                          await request("DELETE", `ShiftRequest/${ID}`);
                          router.push("/changeshiftlist");
                        }}
                      >
                        Delete
                      </Button>
                    :
                      null
                  ]}
            />
        );
    }

    const layout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 16 },
    };

    const errorLayout = {
        wrapperCol: { offset: 4, span: 16 },
    };

    const onFinish = async (values) => {
        setError(null);
        const temp = {
          "RequesterID": JSON.parse( localStorage.getItem("userData") ).ID,
          "RequesterDateTime": moment(values.RequesterDateTime.format("YYYY-MM-DD")).format(),
          "RequesterShift": values.RequesterShift,
          "RequesterArea": values.RequesterArea,
          "RequesteeID": values.RequesteeID,
          "RequesteeDateTime": moment(values.RequesteeDateTime.format("YYYY-MM-DD")).format(),
          "RequesteeShift": values.RequesteeShift,
          "RequesteeArea": values.RequesteeArea,
          "Remark": values.Remark,
          "Status": "Pending",
        }

        if(temp.RequesterDateTime === temp.RequesteeDateTime &&
            temp.RequesterShift === temp.RequesteeShift &&
            temp.RequesterArea === temp.RequesteeArea
            ) { 
            setError("There is no reason to change when you 2 in same roster.");
            return;
        }
        
        messagefunction("Loading");
        if(pageName === "changeshiftadd") {
          const temp1 = await request("POST", `ShiftRequest`, temp);
          if(temp1.Ok) {
            router.push(`/changeshiftlist`);
          } else {
            setError(temp1.Result);
          }
          console.log(temp1);
        } else if(pageName === "changeshiftedit") {
            const temp1 =  await request("PUT", `ShiftRequest/${ID}`, temp);
          if(temp1.Ok) {
            router.push(`/changeshiftlist`);
          } else {
            setError(temp1.Result);
          }
        }
        // router.push(`/changeshiftlist`);
    };

    function disabledDate(current) {
        // Can not select days before today and today
        return current && current < moment(localStorage.getItem('fakelocaltime').split('JBTERRYLIN')[0]).add(-1, 'days').endOf('day');
    }

    const content = () => {
        return (
            <Form 
                {...layout} 
                name="basic"
                ref={formRef}
                style={{ marginTop: "32px" }}
                onFinish={onFinish}
            >
                {
                    error ?
                        <Form.Item {...errorLayout}>
                            <Alert
                                message="Wrong Input"
                                description={error}
                                type="error"
                            />  
                        </Form.Item>
                    :
                    null
                }
                <Form.Item
                    label="My shift date"
                    name="RequesterDateTime"
                    rules={[{ required: true, message: 'Please input Date Time!' }]}
                >
                    <DatePicker
                        disabledDate={disabledDate}
                        allowClear={false}
                        format="YYYY-MM-DD"
                        onChange={(value) => {
                            getData(value);
                            setRequesterArea(null);
                            formRef.current.setFieldsValue({
                                RequesterArea: null,
                                RequesterShift: null,
                            });
                        }}
                    />
                </Form.Item>

                <Form.Item
                    label="My shift area"
                    name="RequesterArea"
                    rules={[{ required: true, message: 'Please input Area!' }]}
                >
                    <Select 
                        onChange={(value) => {
                            setRequesterArea(value);
                            formRef.current.setFieldsValue({
                                RequesterShift: null,
                            });
                        }}
                    >
                        {
                            requesterData &&
                            requesterData[0] &&
                            [...new Set(requesterData[0].Matter.map((element) => element.Area))]
                                .sort()
                                .map((element, index) =>
                                    <Option key={index} value={element}>{areaList ? areaList.find(value => parseInt(value.ID) === parseInt(element)).AreaName : "Unknown"}</Option>
                            )
                        }
                    </Select>
                </Form.Item>
                {
                    requesterArea ?
                        <Form.Item
                            label="My shift"
                            name="RequesterShift"
                            rules={[{ required: true, message: 'Please input Shift!' }]}
                        >
                            <Select>
                                {
                                    requesterData &&
                                    requesterData[0] &&
                                    [
                                        ...new Set(
                                            requesterData[0].Matter.map((element) => element.Shift)
                                        )
                                    ]
                                        .sort()
                                        .map((element,index) =>
                                            <Option key={index} value={element}>{element}</Option>
                                        )
                                }
                            </Select>
                        </Form.Item>
                    :
                        null
                }

                <Form.Item />

                <Form.Item 
                    label="Your requestee" 
                    name="RequesteeID" 
                    rules={[{ required: true, message: 'Please input Requestee!' }]}
                >
                    <Select 
                        placeholder="Please select Teammates" 
                        onChange={(value) => {
                            setRequesteeID(value);
                            setRequesteeArea(null);
                            formRef.current.setFieldsValue({
                                RequesteeArea: null,
                                RequesteeShift: null,
                            });
                        }}
                    >
                    {
                        userData &&
                        userData.map((values, index) =>
                            values.ID !== JSON.parse( localStorage.getItem("userData") ).ID ?
                                <Option key={index} value={values.ID}>{`${values.ID} - ${values.Name}`}</Option>
                            :
                                null
                        )
                    }
                    </Select>
                </Form.Item>

                {
                    requesteeID ?
                        <Form.Item
                            label="Requestee shift date"
                            name="RequesteeDateTime"
                            rules={[{ required: true, message: 'Please input Date Time!' }]}
                        >
                            <DatePicker
                                allowClear={false}
                                format="YYYY-MM-DD"
                                disabledDate={disabledDate}
                                onChange={(value) => {
                                    getRequesteeData(value);
                                    setRequesteeArea(null);
                                    formRef.current.setFieldsValue({
                                        RequesteeArea: null,
                                        RequesteeShift: null,
                                    });
                                }}
                            />
                        </Form.Item>
                    :
                        null
                }
                
                {
                    requesteeID ?
                        <Form.Item
                            label="Requestee area"
                            name="RequesteeArea"
                            rules={[{ required: true, message: 'Please input Area!' }]}
                        >
                            <Select 
                                onChange={(value) => {
                                    setRequesteeArea(value);
                                    formRef.current.setFieldsValue({
                                        RequesteeShift: null,
                                    });
                                }}
                            >
                                {
                                    requesteeData &&
                                    requesteeData[0] &&
                                        [...new Set(requesteeData[0].Matter.map((element) => element.Area))]
                                            .sort()
                                            .map((element, index) =>
                                                <Option key={index} value={element}>{areaList ? areaList.find(value => parseInt(value.ID) === parseInt(element)).AreaName : "Unknown"}</Option>
                                        )
                                }
                            </Select>
                        </Form.Item>
                    :
                        null
                }
                {
                    requesteeArea ?
                        <Form.Item
                            label="Requestee shift"
                            name="RequesteeShift"
                            rules={[{ required: true, message: 'Please input Shift!' }]}
                        >
                            <Select>
                                {
                                    requesteeData &&
                                    requesteeData[0] &&
                                    [
                                        ...new Set(
                                            requesteeData[0].Matter.map((element) => element.Shift)
                                        )
                                    ]
                                        .sort()
                                        .map((element,index) =>
                                            <Option key={index} value={element}>{element}</Option>
                                        )
                                }
                            </Select>
                        </Form.Item>
                    :
                        null
                }

                <Form.Item
                    label="Remark"
                    name="Remark"
                >
                    <TextArea rows={4} />
                </Form.Item>
                
                <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 4 }}>
                    <Button 
                    type="primary"  
                    htmlType="submit"
                    >
                    Submit
                    </Button>
                </Form.Item>
                <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 4 }}>
                    <p>*When you change shift with that day's leader, you will become leader</p>
                </Form.Item>
            </Form>
        );
    }

    return (
        <MainStructure
            content = {
                areaList ?
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
