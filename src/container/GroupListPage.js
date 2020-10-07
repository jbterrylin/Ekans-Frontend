import React, { useState, useEffect } from 'react';
import { 
    PageHeader, 
    Spin,
    Card, 
    Col, 
    Row,
    Typography,
    Button,
    Badge,
    Input,
    Switch
} from 'antd';
import { UserOutlined } from '@ant-design/icons';
import MainStructure from '../component/MainStructure';
import LAvatar from '../component/LAvatar';
import {
    Link
} from "react-router-dom";
import request from '../utils/apisauce';
import checkjob from '../utils/checkjob';

const { Search } = Input;
const { Text } = Typography;

function RosterPage() {
    const [data, setData] = useState(null);

    useEffect(() => {
        const action = async function() {
          var response = await request("GET", `Group`);
          if(response.Ok) {
            response = await request("GET", `Group?limit=${response.Result.meta.total ? response.Result.meta.total : 10}&$Now=true${checkjob(["Nurse"]) ? `&TargetUser=${JSON.parse( localStorage.getItem("userData") ).ID}` : ""}`);
            if(response.Ok) {
                response.Result.result.forEach((element) => {
                element.key = element.ID;
                element.title = element.ID + "-" + element.Name;
              });
              setData(response.Result.result);
            }
          }
        };
        action();
    }, []);

    const getData = async(SearchValue, now) => {
        var response = await request("GET", `Group`);
          if(response.Ok) {
            response = await request("GET", `Group?limit=${response.Result.meta.total ? response.Result.meta.total : 10}${SearchValue ? `&SearchValue=${SearchValue}` : ""}${now ? `&$Now=${now}` : ""}${checkjob(["Nurse"]) ? `&TargetUser=${JSON.parse( localStorage.getItem("userData") ).ID}` : ""}`);
            if(response.Ok) {
                response.Result.result.forEach((element) => {
                element.key = element.ID;
                element.title = element.ID + "-" + element.Name;
              });
              setData(response.Result.result);
            }
        }
    }

    const pageHeader = () => {
        return (
            <PageHeader
                title=" Group List"
                style={{ border: "1px solid rgb(235, 237, 240)", borderLeft: "0px" }} 
                extra={[
                    <Switch 
                        key="1"
                        checkedChildren="NOW" 
                        unCheckedChildren="ALL"
                        defaultChecked={true}
                        onClick={(e) => {
                            getData(null, e);
                        }} 
                    />,
                    <Search
                        key="2"
                        placeholder="input group name"
                        onSearch={(value) => getData(value)}
                        style={{ width: 200 }}
                    />,
                    checkjob(["Manager"]) ? 
                        <Button key="3" type="primary"><Link to="/groupadd">Add Group</Link></Button>
                    :
                        null
                ]}
            />
        );
    }

    const gridStyle = {
        width: '50%',
        textAlign: 'center',
    };

    const cardList = () => {
        return(
            <Row gutter={16} style={{ marginTop: "32px" }}>
                {
                    data &&
                    data.map((values, index) => 
                        <Col key={index} justify="center" style={{ marginBottom: "16px" }} span={8}>
                            <Card title={`${values.GroupName} ${values.IsDeleted ? "(deleted)" : ""}`} extra={checkjob(["Manager"]) ? <Link to={`/groupedit/${values.ID}`}>Edit</Link> : null} style={{ width: 350 }}>
                                {
                                    values.Details.map((elements, indexdex) => 
                                        <Card.Grid key={indexdex} style={gridStyle}>
                                            <Link to={checkjob(["Admin","Manager"]) ? `/userdetail/${elements.ID}` : '#'}>
                                                <Badge count={elements.ID === values.LeaderID ? "T" : null}>
                                                    <LAvatar 
                                                        condition = {
                                                            elements.Picture !== ""
                                                        }
                                                        icon = {{condition: false, icon: <UserOutlined />}}
                                                        src={{condition: true, src: elements.Picture}}
                                                        size={"large"}  
                                                    />
                                                </Badge>
                                                <br />
                                                <Text strong>
                                                    {
                                                        elements.Exist ?
                                                            elements.Name
                                                        :
                                                            "Not Exist"
                                                    }
                                                </Text>
                                            </Link>
                                        </Card.Grid>
                                    )
                                }
                            </Card>
                        </Col>
                    )
                }
            </Row>
        );
    }
  
    return (
        <MainStructure
            content = {
                data ?
                    <div>
                        {pageHeader()}
                        <div style={{ marginLeft: "32px" }}>
                            {cardList()}
                        </div>
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

export default RosterPage; 
