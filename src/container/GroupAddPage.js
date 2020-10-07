import React, { useState, useEffect, useRef } from 'react';
import { 
    PageHeader,
    Form, 
    Input, 
    Button, 
    Select,
} from 'antd';
import {  } from '@ant-design/icons';
import MainStructure from '../component/MainStructure';
import request from '../utils/apisauce';
import messagefunction from '../utils/messagefunction';
import{ useHistory, useParams } from 'react-router-dom';

const { Option } = Select;

function GroupAddPage() {
  const formRef = useRef();
  const router = useHistory();
  const { ID } = useParams();
  const pageName = router.location.pathname.indexOf("/groupedit") !== -1 ? "groupedit" : "groupadd";

  const [userData, setUserData] = useState(null);
  const [teammatesID, setTeammatesID] = useState(null);
  const [errorTeammatesID, setErrorTeammatesID] = useState("");
  
  useEffect(() => {
    const action = async function() {
      // get group data
      var response;
      if (pageName === "groupedit"){
        response = await request("GET", `Group/${ID}`);
        response = response.Result.result;
        response.Details.forEach((element) => {
          element.key = element.ID;
          element.title = element.ID + " - " + element.Name;
        });

        setTeammatesID(response.IDAddName);

        formRef.current.setFieldsValue({
          GroupName: response.GroupName,
          TeammatesID: response.IDAddName,
          LeaderID: response.IDAddName.filter((IDAddName) => IDAddName.split(" ")[0].includes(response.LeaderID.toString()))[0],
        });
      }

      // get all User
      response = await request("GET", "User");
      if(response.Ok) {
        response = await request("GET", `User?limit=${response.Result.meta.total ? response.Result.meta.total : 10}&$JobCategory=('Nurse')&$Now=true`);
        if(response.Ok) {
          response.Result.result.forEach((element) => {
            element.key = element.ID;
            element.title = element.ID + " - " + element.Name;
          });
          setUserData(response.Result.result);
        }
      }
    };
    action();
  },[ID,pageName]);

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };

  const pageHeader = () => {
    return (
      <PageHeader
        title={pageName ==="groupadd" ? "Create group" : "Edit group"}
        style={{ border: "1px solid rgb(235, 237, 240)", borderLeft: "0px" }} 
        extra={[
          pageName === "groupedit" ?
            <Button 
              key="1"
              danger 
              type="primary" 
              onClick={async() => {
                var temp = {
                  IsDeleted: true
                };
                await request("PUT", `Group/${ID}`, temp);
                router.push("/grouplist");
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

  const onFinish = async (values) => {
    var temp = formRef.current.getFieldValue().TeammatesID;
    if( temp.includes( formRef.current.getFieldValue().LeaderID ) ) {
      temp = temp.filter(function(e) { return e !== formRef.current.getFieldValue().LeaderID })
    }
    if(temp.length <= 3 || temp.length >= 6) {
      setErrorTeammatesID("TeammatesID input should minimum 5 and maximum 6");
      return;
    }
    messagefunction("Loading");
    values.TeammatesID = temp;
    values.LeaderID = values.LeaderID.split(" ")[0];
    values.TeammatesID.forEach((item,index) => {
        values.TeammatesID[index] = item.split(" ")[0];
      }
    );
    if(pageName === "groupadd") {
      await request("POST", `Group`,values);
    } else {
      await request("PUT", `Group/${ID}`,values);
    }
    
    router.push(`/grouplist`);
  };

  const teammateIDOnChange = (values) => {
    setTeammatesID(values);
    if( !formRef.current.getFieldValue().TeammatesID.includes( formRef.current.getFieldValue().LeaderID ) ) {
      formRef.current.setFieldsValue({
        LeaderID: null
      });
    }
  }
  
  const form = () => {
    return (
      <Form 
        {...layout} 
        ref={formRef}
        name="basic"
        onFinish={onFinish} 
        style={{ marginTop: "32px" }}
      >
        <Form.Item 
          name="GroupName" 
          label="Group Name"
          rules={[{ required: true, message: 'Please input Group Name!' }]}
        >
          <Input style={{ width: 500 }} />
        </Form.Item>

        <Form.Item 
          name="TeammatesID" 
          label="TeammatesID" 
          rules={[{ required: true, message: 'Please input Teammates!' }]}
          validateStatus={errorTeammatesID ? "error" : null}
          help={errorTeammatesID ? errorTeammatesID : null}
        >
          <Select mode="multiple" placeholder="Please select Teammates" onChange={(values) => teammateIDOnChange(values)}>
            {
              userData &&
              userData.map((values, index) =>
                <Option key={index} value={values.title}>{values.title}</Option>
              )
            }
          </Select>
        </Form.Item>

        <Form.Item 
          name="LeaderID" 
          label="Leader ID" 
          rules={[{ required: true, message: 'Please input Leader!' }]}
        >
          <Select placeholder="Please select Leader">
            {
              teammatesID &&
              teammatesID.map((values, index) =>
                <Option key={index} value={values}>{values}</Option>
              )
            }
          </Select>
        </Form.Item>

        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 4 }}>
          <Button 
            type="primary"  
            htmlType="submit"
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    );
  }

  return (
    <MainStructure
      content = {
        <div>
          {pageHeader()}
          {form()}
        </div>
      }
    />
  );
}

export default GroupAddPage; 
