import React, { useState, useEffect } from 'react';
import { PageHeader, Calendar, Badge, Spin } from 'antd';
import MainStructure from '../component/MainStructure';
import moment from 'moment';
import request from '../utils/apisauce';
import{ useParams } from 'react-router-dom';

function CalanderPage() {
    const { ID } = useParams();
    const [data, setData] = useState(null);
    const [month, setMonth] = useState(null);
    const [areaList, setAreaList] = useState([]);
    const [userName, setUserName] = useState(null);

    useEffect(() => {
        const action = async function() {
            // var temp3 = await request("GET", `User`, requestVar);
            const requestVar = {
                ID: ID ? ID : JSON.parse( localStorage.getItem("userData") ).ID,
                DateTime: moment(localStorage.getItem('fakelocaltime').split('JBTERRYLIN')[0]).format(),
            };
        
            var calanderData = await request("GET", `Calander`, requestVar);
            if(calanderData.Ok) {
                setData(calanderData.Result.DayList);
                setMonth(moment(localStorage.getItem('fakelocaltime').split('JBTERRYLIN')[0]).month());
            }

            var response1 = await request("GET", `User/${ID ? ID : JSON.parse( localStorage.getItem("userData") ).ID}`);
            console.log(response1);
            if (response1.Ok) {
                setUserName(response1.Result.result.Name);
            }

            var response = await request("GET", "Area");
            if (response.Ok) {
                setAreaList(response.Result.result);
            }
        };
        action();
    },[ID]);  
    
    const setCalanderData = async(value) => {
        const requestVar = {
            ID: ID ? ID : JSON.parse( localStorage.getItem("userData") ).ID,
            DateTime: value.format(),
        };
    
        var calanderData = await request("GET", `Calander`, requestVar);
        if(calanderData.Ok) {
            setData(calanderData.Result.DayList);
            setMonth(value.month());
        }
    }

    const pageHeader = () => {
        return (
            <PageHeader
                title={`${ID ? userName : JSON.parse( localStorage.getItem("userData") ).Name}'s Calander`}
                style={{ border: "1px solid rgb(235, 237, 240)", borderLeft: "0px" }} 
            />
        );
    }

    const status = (item, value) => {
        if(item.Situation === "Attend") {
            return 'success';
        } else if(item.Situation === "MC" || item.Situation === "Annual Leave") {
            return 'warning';
        } else if(item.Situation === "Not Come") {
            const temp = localStorage.getItem('fakelocaltime').split('JBTERRYLIN');
            if(moment(temp[0]).isAfter(value)) {
                return 'error';
            } else {
                return 'processing';
            }
        }
        return 'warning';
    }

    const dateCellRender = (value) => {
        if(value.month() !== month) {
            return null;
        }
        const temp = data.filter(day => day.Number === value.date())[0];
        return (
            <div className="events">
                {
                    temp ?
                    temp.Matter.map((item,index)=> (
                        <div key={index}>
                            <Badge 
                                status={status(item,value)}
                                text={
                                        `${item.Shift} - 
                                        ${areaList && areaList.filter((area) => area.ID === item.Area).length > 0 ?
                                            areaList.filter((area) => area.ID === item.Area)[0].AreaName
                                        :
                                            "Unknown"
                                        } 
                                        ${item.Situation === "MC" || item.Situation === "Annual Leave" ?
                                            "(" + item.Situation + ")"
                                        :
                                            ""
                                        }` 
                                }
                            />
                        </div>
                    ))
                    :
                    null
                }
            </div>
        );
    }
    
    const content = () => {
        return (
            <Calendar 
                onChange={(value) => setCalanderData(value)}
                style={{ padding: "16px" }} 
                dateCellRender={(value) => dateCellRender(value)} 
                defaultValue={() => 
                    localStorage.getItem('fakelocaltime') ? 
                        moment(localStorage.getItem('fakelocaltime').split("JBTERRYLIN")[0]) 
                    :   
                        moment()
                }
            />
        );
    }
    
    return (
        <MainStructure
            content = {
                data ?
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

export default CalanderPage; 