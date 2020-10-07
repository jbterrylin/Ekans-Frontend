import React, { useState, useEffect } from 'react';
import { 
  Layout, 
  Menu, 
  Typography, 
  Dropdown,
  Tooltip
} from 'antd';
import { 
  TeamOutlined, 
  UserOutlined, 
  CalendarOutlined,
  MedicineBoxOutlined,
  ApartmentOutlined,
  UserSwitchOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import {
  Link
} from "react-router-dom";
import LDatePicker from '../component/LDatePicker';
import LAvatar from '../component/LAvatar';
import{ useHistory } from 'react-router-dom';
import checkjob from '../utils/checkjob';
import moment from 'moment';
import request from '../utils/apisauce';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

function MainStructure(props) {
  const router = useHistory();
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const action = async function() {
        const requestVar = {
          DateTime: moment(localStorage.getItem('fakelocaltime').split('JBTERRYLIN')[0]).format(),
        };
        
        if (checkjob(["Admin"])) {
          var CheckRosterExistData = await request("GET", `CheckRosterExist`, requestVar);
          var temp = "";
          if(CheckRosterExistData.Ok) {
            CheckRosterExistData.Result &&
            CheckRosterExistData.Result.forEach(element => {
              temp += `${moment(element.DateTime).format("YYYY-MM-DD")}'s `;
              element.AreasShift &&
              element.AreasShift.forEach(element1 => {
                temp+= element1.Area + "(";
                if(element1.Shift) {
                  element1.Shift.forEach((value) => {
                    temp += value +", ";
                  });
                  temp = temp.substring(0,temp.length-2);
                }
                temp+="), ";
              })
            });
            if(temp !== "") {
              setMessage(temp.substring(0,temp.length-2) + " havent create roster");
            }
          }
        }
    };
    action();
},[]);  

  const sider = () => {
    return(
      <Sider>
        <Menu style={{ height: "100%" }}>
          <div style={{ textAlign: "center", height: "56px", marginTop:"8px", paddingTop: "7px" }}>
              <Title style={{ marginTop: "5px", display:"inline", marginLeft: "-10px" }} level={4}>
                <img style={{ width: "14%", marginRight: "8px" }} src={require("../resource/logo.png")}  alt="logo" />
                Ekans Hospital
              </Title>
          </div>
          <Menu.Item key="1" icon={<TeamOutlined />}>
            <Link to="/rosterlist">
              Roster
            </Link>
          </Menu.Item>
          {
            checkjob(["Nurse", "PTNurse"]) ?
              <Menu.Item key="2" icon={<CalendarOutlined />}>
                <Link to={"/calander"}>
                  Calander
                </Link>
              </Menu.Item>
            :
              null
          }
          {
            checkjob(["Admin", "Nurse", "PTNurse"]) ?
              <Menu.Item key="3" icon={<MedicineBoxOutlined />}>
                <Link to="/leavelist">
                  Leave
                </Link>
              </Menu.Item>
            :
              null
          }
          {
            checkjob(["Admin","Manager","Nurse"]) ?
              <Menu.Item key="4" icon={<ApartmentOutlined />}>
                <Link to="/grouplist">
                  Group
                </Link>
              </Menu.Item>
            :
              null
          }
          
          {
            checkjob(["Nurse"]) ?
              <Menu.Item key="5" icon={<UserSwitchOutlined />}>
                <Link to="/changeshiftlist">
                  Change Shift
                </Link>
              </Menu.Item>
            :
              null
          }
          <Menu.Item key="6" icon={<UserSwitchOutlined />}>
            <Link to={checkjob(["Admin", "Manager"]) ? "/userlist" : `/userdetail/${JSON.parse( localStorage.getItem("userData") ).ID}`}>
              User
            </Link>
          </Menu.Item>
        </Menu>
      </Sider>
    );
  }

  const menu = (
    <Menu>
      <Menu.Item 
        key="1" 
        onClick={() => {
          localStorage.removeItem("userData");
          router.push("");
        }}
      >
        Log Out
      </Menu.Item>
    </Menu>
  );
  
  const header = () => {
    return (
      <div style={{ textAlign: "right" }}>
        {
          message ?
            <Tooltip placement="bottom" title={message}>
              <ExclamationCircleOutlined style={{ marginRight: "16px", cursor: "pointer", fontSize: '1.2rem', color: "#FF0000" }} />
            </Tooltip>
          :
            null
        }
        <LDatePicker />
        <LAvatar 
          condition = {JSON.parse( localStorage.getItem("userData") ).Picture !== ""}
          icon = {{condition: false, icon: <UserOutlined />}}
          src={{condition: true, src: JSON.parse( localStorage.getItem("userData") ).Picture}} 
          size="large" 
        />
        <Dropdown overlay={menu} trigger={['click']} placement="bottomCenter" arrow>
          <Text strong={true} style={{ marginLeft: "16px", cursor: "pointer" }}>{`${JSON.parse( localStorage.getItem("userData") ).Job} - ${JSON.parse( localStorage.getItem("userData") ).Name}`}</Text>
        </Dropdown>
      </div>
    );
  }
  
  return (
    <Layout style={{ height: "100%" }}>
      {sider()}
      <Layout key="1" className="site-layout"  style={{ backgroundColor: "#FFFFFF", borderBottom: "1px solid rgb(235, 237, 240)" }}>
          <Header style={{ backgroundColor: "#FFFFFF" }}>
              {header()}
          </Header>
          <Content>
              {props.content}
          </Content>
      </Layout>
    </Layout>
  );
}
  
  export default MainStructure; 