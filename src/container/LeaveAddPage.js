import React, { useState, useEffect, useRef } from 'react';
import { PageHeader, Form, Input, DatePicker, Button, Select, Checkbox, Alert } from 'antd';
import MainStructure from '../component/MainStructure';
import request from '../utils/apisauce';
import messagefunction from '../utils/messagefunction';
import moment from 'moment';
import { extendMoment } from 'moment-range';
import{ useHistory } from 'react-router-dom';

const momentWithRange = extendMoment(moment);
const { Option } = Select;
const { RangePicker } = DatePicker;

function LeaveAddPage() {
  const [managerList, setManagerList] = useState(null);
  const [nurseList, setNurseList] = useState(null);
  const [detailcb, setDetailCB] = useState(false);
  const [Error, setError] = useState(null);
  const router = useHistory();
  const formRef = useRef();

  useEffect(() => {
    const action = async function() {
      // get all User
      var temp1 = await request("GET", `User`);
      if(temp1.Ok) {
        temp1 = await request("GET", `User?limit=${temp1.Result.meta.total ? temp1.Result.meta.total : 10}&$Now=true&$JobCategory=('Nurse')`);
        if(temp1.Ok) {
          temp1.Result.result.forEach((element) => {
            element.key = element.ID;
            element.title = element.ID + " - " + element.Name;
          });
          setNurseList(temp1.Result.result);
        }
      }
    };
    action();
  },[]);

  useEffect(() => {
    const action = async function() {
      // get all User
      var temp1 = await request("GET", `User`);
      if(temp1.Ok) {
        temp1 = await request("GET", `User?limit=${temp1.Result.meta.total ? temp1.Result.meta.total : 10}&$Now=true&$JobCategory=('Manager')`);
        if(temp1.Ok) {
          temp1.Result.result.forEach((element) => {
            element.key = element.ID;
            element.title = element.ID + " - " + element.Name;
          });
          setManagerList(temp1.Result.result);
        }
      }
    };
    action();
  },[]);

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };

  const errorLayout = {
    wrapperCol: { offset: 4, span: 16 },
  };

  const pageHeader = () => {
    return (
      <PageHeader
        title="Leave form"
        style={{ border: "1px solid rgb(235, 237, 240)", borderLeft: "0px" }} 
      />
    );
  }

  const shift = ["Q1", "Q2", "Q3"];

  const onFinish = async(values,Check) => {
    setError(null);
    var errortemp = "";
    var range = momentWithRange().range(values.Datetime[0].format("YYYY-MM-DD"), values.Datetime[1].format("YYYY-MM-DD")); /*can handle leap year*/ 
    range = Array.from(range.by("days"));
    var counter = false;
    for (const [index, element] of range.entries()) {
      for (const element1 of shift) {
        if(detailcb && index === 0) {
          if(values.startShift && values.startShift === element1) {
            counter = true;
          }
        }
        if(!detailcb || counter) {
          if(values.endShift && index === range.length-1 && element1 === values.endShift) {
            counter = false;
          }
          // api call
          var temp = {
            DateTime: moment(element).format(),
            Shift: element1,
            NurseID: values.NurseID,
            Type: values.Type,
            Remark: values.Remark,
            ApprovedBy: values.ApprovedBy,
            Check: Check,
          };
          temp = await request("POST", "/Leave", temp);
          if(Check && temp.Result !== "Not Exist but it is check, so didn't post it") {
            errortemp += "(" + moment(temp.Result.split("JBTERRYLIN")[0]).format("YYYY-MM-DD") + " " + temp.Result.split("JBTERRYLIN")[1] + "), ";
          }
        }
      };
    };
    if(errortemp === "") {
      if(Check === false) {
        router.push(`/leavelist`);
        return;
      }
      messagefunction("Loading");
      onFinish(values,false);
    } else {
      setError(errortemp + "already in record");
    }
  };

  function disabledDate(current) {
    // Can not select days before today and today
    return current && current < moment(localStorage.getItem('fakelocaltime').split('JBTERRYLIN')[0]).add(-1, 'days').endOf('day');
  }

  const form = () => {
    return (
      <Form 
        {...layout} 
        name="nest-messages" 
        ref={formRef}
        onFinish={(values) => onFinish(values,true)} 
        style={{ marginTop: "32px" }}
      >
        {
          Error ?
            <Form.Item {...errorLayout}>
              <Alert
                message="Wrong Input"
                description={Error}
                type="error"
              />  
            </Form.Item>
          :
            null
        }
        <Form.Item name="NurseID" label="NurseID" rules={[{ required: true, message: 'Please input NurseID!' }]}>
          <Select placeholder="Please select Nurse">
            {
              nurseList &&
              nurseList.map((values, index) =>
                <Option key={index} value={values.ID}>{`${values.ID} - ${values.Name}`}</Option>
              )
            }
          </Select>
        </Form.Item>
        <Form.Item name="Type" initialValue="MC" label="Type" rules={[{ required: true, message: 'Please input Type!' }]}>
          <Select>
            <Option value="MC">MC</Option>
            <Option value="Annual Leave">Annual Leave</Option>
          </Select>
        </Form.Item>
        <Form.Item name="Datetime" initialValue={moment(localStorage.getItem('fakelocaltime').split('JBTERRYLIN')[0])} label="Date" rules={[{ required: true, message: 'Please input Date!' }]}>
          <RangePicker 
            format="YYYY-MM-DD"  
            disabledDate={disabledDate}
          />
        </Form.Item>
        <Form.Item name="detail" label="Detail for date" valuePropName="checked">
          <Checkbox onChange={(value) =>  setDetailCB(value.target.checked)}></Checkbox>
        </Form.Item>
        {
          detailcb ?
            <Form.Item name="startShift" label="Shift for start date" initialValue="Q1" rules={[{ required: true, message: 'Please input Shift!' }]}>
              <Select>
                  <Option value="Q1">Q1</Option>
                  <Option value="Q2">Q2</Option>
                  <Option value="Q3">Q3</Option>
              </Select>
            </Form.Item>
          :
            null
        }
        {
          detailcb ?
            <Form.Item name="endShift" label="Shift for end date" initialValue="Q3" rules={[{ required: true, message: 'Please input Shift!' }]}>
              <Select>
                  <Option value="Q1">Q1</Option>
                  <Option value="Q2">Q2</Option>
                  <Option value="Q3">Q3</Option>
              </Select>
            </Form.Item>
          :
            null
        }
        <Form.Item name="Remark" label="Remark">
          <Input.TextArea
            autoSize={{ minRows: 5 }}
          />
        </Form.Item>
        <Form.Item name="ApprovedBy" label="ApprovedBy" rules={[{ required: true, message: 'Please input ApprovedBy!' }]}>
          <Select placeholder="Please select Teammates">
            {
              managerList &&
              managerList.map((values, index) =>
                <Option key={index} value={values.ID}>{`${values.ID} - ${values.Name}`}</Option>
              )
            }
          </Select>
        </Form.Item>
        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 4 }}>
          <Button type="primary" htmlType="submit">
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
  
  export default LeaveAddPage; 