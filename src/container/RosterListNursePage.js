import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Avatar, 
  PageHeader, 
  Collapse, 
  Divider, 
  Row, 
  Col, 
  Card,
  Button,
  DatePicker, 
  Select,
  message,
  Result,
  Spin
} from 'antd';
import { 
  UserOutlined, 
  SmallDashOutlined,
  WhatsAppOutlined, 
  CheckOutlined,
  CloseOutlined,
  QuestionOutlined
} from '@ant-design/icons';
import MainStructure from '../component/MainStructure';
import { Link } from "react-router-dom";
import moment from 'moment';
import{ useParams } from 'react-router-dom';
import request from '../utils/apisauce';
import checkjob from '../utils/checkjob';

const { Text } = Typography;
const { Panel } = Collapse;
const { Meta } = Card;
const { Option } = Select;

function RosterListNursePage() {
  const { Date, Area, Shift } = useParams();
  const [areaList, setAreaList] = useState(null);
  const [date, setDate] = useState(Date);
  const [area, setArea] = useState(Area);
  const [shift, setShift] = useState(Shift);
  const [rosterData, setRosterData] = useState(null);
  const [attendances, setAttandances] = useState([]);
  const [update, setUpdate] = useState(false);
  const [stopMount, setStopMount] = useState(false);
  const [groupName, setGroupName] = useState(null);

  const getData = async(date1, area1, shift1) => {
    setGroupName(null);
    const requestVar = {
      DateTime: moment(date1 ? date1 : date).format(),
      Area: area1 ? area1 : area,
      Shift: shift1 ? shift1 :shift,
    };

    var aaa = await request("GET", `Roster`, requestVar); 
    if(aaa.Ok) {
      setRosterData(aaa.Result.result ? aaa.Result.result[0] : null);
      setAttandances(aaa.Result.result[0] && aaa.Result.result[0].Attendances ? aaa.Result.result[0].Attendances : []);
      setGroupName(aaa.Result.result[0] && aaa.Result.result[0].GroupName ? aaa.Result.result[0].GroupName : null);
    }
  }


  useEffect(() => {
    const action = async function() {

      var response = await request("GET", "Area");
      if (response.Ok) {
        setAreaList(response.Result.result);
      }
      
      if(!Date || !Shift || !Area) {
        setDate(moment(localStorage.getItem('fakelocaltime').split('JBTERRYLIN')[0]).format("YYYY-MM-DD"));
        setArea(response.Result.result[0].ID);
        setShift(localStorage.getItem('fakelocaltime').split('JBTERRYLIN')[1]);
      }
      
      const requestVar = {
        DateTime: moment(date).format(),
        Shift: shift,
        Area: area,
      };
      
      var temp3 = await request("GET", `Roster`, requestVar);
      if(temp3.Ok && temp3.Result.result.length === 1) {
        setRosterData(temp3.Result.result[0]);
        setAttandances(temp3.Result.result[0].Attendances ? temp3.Result.result[0].Attendances : []);
        setGroupName(temp3.Result.result[0].GroupName);
      }
      setStopMount(true);
    };
    if (!stopMount) {
      action();
    }
  },[Date, Area, Shift, date, area, shift, stopMount]);  

  const pageHeader = () => {
    return (
      <PageHeader
        className="site-page-header"
        title={
          <div>
            <DatePicker
              format="YYYY-MM-DD"
              size="small"
              allowClear={false}
              style={{ height: "24px" }}
              defaultValue={moment(date)}
              onChange={(value) => {
                setDate(value.format("YYYY-MM-DD"));
                getData(value.format("YYYY-MM-DD"), null, null);
              }}
            />
            <Select 
              defaultValue={Area ? areaList.find(value => parseInt(value.ID) === parseInt(Area)).AreaName  : areaList[0].AreaName} 
              style={{ width: 120, marginLeft: "16px" }} 
              size="small" 
              onChange={(value) => {
                setArea(value);
                getData(null, value, null);
              }}
            >
              {
                areaList &&
                areaList.map((value, index) => 
                  <Option key={index} value={value.ID}>{value.AreaName}</Option>
                )
              }
            </Select>
            <Select 
              defaultValue={Shift ? Shift : localStorage.getItem('fakelocaltime').split('JBTERRYLIN')[1]} 
              style={{ width: 120, marginLeft: "16px" }} 
              size="small" 
              onChange={(value) => {
                setShift(value);
                getData(null, null, value);
              }}
            >
              <Option value="Q1">Q1</Option>
              <Option value="Q2">Q2</Option>
              <Option value="Q3">Q3</Option>
            </Select>
            <Text> 's Roster{groupName ? ` (group ${groupName})` : ` (group Unknown)`}</Text>
          </div>
        }
        style={{ border: "1px solid rgb(235, 237, 240)", borderLeft: "0px" }} 
        extra={[
          moment(localStorage.getItem('fakelocaltime').split('JBTERRYLIN')[0]).add(-1, 'days').isBefore(moment(date)) &&
          checkjob(["Admin"]) ?
            <Button key="1" type="primary">
                <Link to={`/rosteradd/${date}/${area}/${shift}`}>{rosterData ? "Edit Roster" : "Create Roster"}</Link>
            </Button>
          :
            null
        ]} 
      />
    );
  }

  const messageShow = (condition, nurseName) => {
    if(condition) {
      message.success(`${nurseName}'s attandance is update successfully`);
    } else {
      message.error(`${nurseName}'s attandance is update successfully`);
    }
  }
  
  const cardGrid = (group) => {
    var temp = [];
    if (rosterData) {
      if(group === "Leader") {
        temp = rosterData.Details.filter((value) => value.ID === rosterData.LeaderID);
      } else if(group === "Nurse") {
        temp = rosterData.Details.filter((value) => rosterData.NursesID.includes(value.ID));
      } else if(group === "PTNurse") {
        if(rosterData.PTNursesID)
          temp = rosterData.Details.filter((value) => rosterData.PTNursesID.includes(value.ID));
      } else if(group === "BUNurse") {
        if(rosterData.BUNursesID)
          temp = rosterData.Details.filter((value) => rosterData.BUNursesID.includes(value.ID));
      }
    }
    
    return (
      <Row justify="start" style={{marginLeft: "32px" }}>
        {
          temp && 
          temp.map((element, index) => 
              <Col span={8} key={index}>
                <Card 
                  style={{ marginTop: 16, marginRight: 16 }}
                  actions={[
                    checkjob(["Admin", "Manager"]) ?
                      <Link to={`/userdetail/${element.ID}`}>
                        <SmallDashOutlined key="detail"  />
                      </Link>
                    :
                      null,
                    <WhatsAppOutlined key="whatsapp" onClick={() => window.open(`http://wa.me/${element.PhoneNumber}`, "_blank")} />,
                    ((checkjob(["Nurse"]) && 
                    JSON.parse( localStorage.getItem("userData") ).ID === rosterData.LeaderID) ||
                    checkjob(["Admin"])) &&
                    moment(localStorage.getItem('fakelocaltime').split('JBTERRYLIN')[0]).add(-15, 'days').isBefore(date, "days") ?
                      !attendances.includes(element.ID) ?
                        <CheckOutlined 
                          key="check" 
                          onClick={async(value) => {
                            attendances.push(element.ID);
                            setAttandances(attendances);
                            setUpdate(!update);
                            const ttt = {
                              Attendances: attendances,
                            }
                            var temp3 = await request("PATCH", `Roster/${rosterData.ID}`, ttt);
                            messageShow(temp3.Ok, element.Name);
                          }}
                        />
                      :
                        <CloseOutlined 
                          key="check" 
                          onClick={async(value) => {
                            setAttandances(attendances.filter((value) => value !== element.ID));
                            setUpdate(!update);
                            const ttt = {
                              Attendances: attendances.filter((value) => value !== element.ID),
                            }
                            var temp3 = await request("PATCH", `Roster/${rosterData.ID}`, ttt);
                            messageShow(temp3.Ok, element.Name);
                          }}
                        />
                      :
                        "Can't edit"
                  ]}
                >
                  <Meta
                    avatar={
                      <Avatar 
                        size={64} 
                        icon={<UserOutlined />} 
                        style={{ marginLeft: "32px" }}
                      />
                    }
                    title={element.Name}
                    description={
                      <div>
                        <Text>
                          Id: {element.ID}<br />
                          No Tel: {element.PhoneNumber}<br />
                          Job: {element.Job}
                        </Text>
                      </div>
                    }
                  />
                </Card>
              </Col>
          )
        }
      </Row>
    )
  }
  
  const dividerString = ["Leader", "Nurse", "PTNurse", "BUNurse"];
  
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
                {cardGrid(string)}
              </Panel>
            </Collapse>
          )
        }
      </div>
    );
  }

  const noData = () => {
    return (
          moment(localStorage.getItem('fakelocaltime').split('JBTERRYLIN')[0]).isBefore(moment(date)) ?
            <Result
              icon={<QuestionOutlined />}
              title="Havent create roster for this shift"
              extra={
                <Link to={`/rosteradd/${date}/${area}/${shift}`}>
                  {
                    checkjob(["Admin"]) ?
                      <Button key="1" type="primary">
                        Create Roster
                      </Button>
                    :
                      null
                  }
                  
                </Link>
              }
            />
          :
            <Result
              icon={<QuestionOutlined />}
              title="No data for this day"
            />
    );
  }
  
  return (
    <MainStructure
      content = {
        areaList && date && area && shift ?
          <div>
              {pageHeader()}
              {
                rosterData ?
                  content()
                :
                  noData()
              }
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

export default RosterListNursePage; 
