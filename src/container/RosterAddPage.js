import React, { useState,useEffect, useRef } from 'react';
import { 
    PageHeader,
    Form, 
    Button, 
    Select,
    DatePicker,
    Typography,
    Switch,
    Spin
} from 'antd';
import MainStructure from '../component/MainStructure';
import request from '../utils/apisauce';
import messagefunction from '../utils/messagefunction';
import{ useParams, useHistory } from 'react-router-dom';
import moment from 'moment';

const { Option } = Select;
const { Text } = Typography;

function RosterAddPage() {
  const formRef = useRef();
  const router = useHistory();
  const { Date, Shift, Area } = useParams();
  const [areaList, setaAreaList] = useState([]);

  const [rosterDataID, setRosterDataID] = useState(0);
  const [groupList, setGroupList] = useState(null);
  const [nurseList, setNurseList] = useState([]);
  const [pTNursesList, setPTNurseList] = useState([]);
  
  const [selectedNursesID, setSelectedNursesID] = useState([]);
  const [selectedBUNursesID, setSelectedBUNursesID] = useState([]);
  const [date, setDate] = useState(null);
  const [shift, setShift] = useState(null);
  const [area, setArea] = useState(null);
  const [errorNursesID, setErrorNursesID] = useState("");

  const clearForm = () => {
      formRef.current.setFieldsValue({
        GroupID: null,
        LeaderID: null,
        NursesID: [],
        BUNursesID: [], 
        PTNursesID: []
      });
      setSelectedNursesID([]);
      setSelectedBUNursesID([]);
  }

  const getRosterData = async(date, shift, area) => {
    const requestVar = {
      DateTime: moment(date).format(),
      Shift: shift,
      Area: area
    };

    var rosterData = await request("GET", `Roster`, requestVar);
    if(rosterData.Ok && rosterData.Result.result.length === 1) {
      rosterData = rosterData.Result.result[0];
      setSelectedNursesID(
        nurseList.filter((value) => rosterData.NursesID.includes(value.ID)).map((value) => value.title)
      );
      formRef.current.setFieldsValue({
        GroupID: rosterData.GroupName,
        LeaderID: rosterData.LeaderIDAddName,
        NursesID: rosterData.NursesIDAddName,
        BUNursesID: rosterData.BUNursesIDAddName ? rosterData.BUNursesIDAddName : [], 
        PTNursesID: rosterData.PTNursesIDAddName ? rosterData.PTNursesIDAddName : []
      });
      setSelectedNursesID(rosterData.NursesIDAddName ? rosterData.NursesIDAddName : []);
      setSelectedBUNursesID(rosterData.BUNursesIDAddName ? rosterData.BUNursesIDAddName : []);
      setRosterDataID(rosterData.ID);
    }
  }

  useEffect(() => {
    const action = async function() {
      setDate(Date);
      setShift(Shift);
      setArea(Area);

      var response = await request("GET", "Area");
      if(response.Ok) {
        setaAreaList(response.Result.result);
      }

      var grouplist = await request("GET", `Group`);
      if(grouplist.Ok) {
        grouplist = await request("GET", `Group?limit=${grouplist.Result.meta.total ? grouplist.Result.meta.total : 10}`);
        if(grouplist.Ok) {
          grouplist.Result.result.forEach((element) => {
            element.key = element.ID;
            element.title = element.ID + " - " + element.Name;
          });
          setGroupList(grouplist.Result.result);
        }
      }

      var nurseList = await request("GET", `User`);
      if(nurseList.Ok) {
        nurseList = await request("GET", `User?limit=${nurseList.Result.meta.total ? nurseList.Result.meta.total : 10}&$JobCategory=('Nurse')&$Now=true`);
        if(nurseList.Ok) {
          nurseList = nurseList.Result.result;
          nurseList.forEach((element) => {
            element.key = element.ID;
            element.title = element.ID + " - " + element.Name;
          });
          setNurseList(nurseList);
        }
      }
      
      var pTNurseList = await request("GET", `User`);
      if(pTNurseList.Ok) {
        pTNurseList = await request("GET", `User?limit=${pTNurseList.Result.meta.total ? pTNurseList.Result.meta.total : 10}&$JobCategory=('PTNurse')&$Now=true`);
        if(pTNurseList.Ok) {
          pTNurseList.Result.result.forEach((element) => {
            element.key = element.ID;
            element.title = element.ID + " - " + element.Name;
          });
          setPTNurseList(pTNurseList.Result.result);
        }
      }
      const requestVar = {
        DateTime: moment(Date).format(),
        Shift: Shift,
        Area: Area
      };
  
      var rosterData = await request("GET", `Roster`, requestVar);
      if(rosterData.Ok && rosterData.Result.result.length === 1) {
        rosterData = rosterData.Result.result[0];
        setSelectedNursesID(
          nurseList.filter((value) => rosterData.NursesID.includes(value.ID)).map((value) => value.title)
        );
        formRef.current.setFieldsValue({
          GroupID: rosterData.GroupName,
          LeaderID: rosterData.LeaderIDAddName,
          NursesID: rosterData.NursesIDAddName,
          BUNursesID: rosterData.BUNursesIDAddName ? rosterData.BUNursesIDAddName : [], 
          PTNursesID: rosterData.PTNursesIDAddName ? rosterData.PTNursesIDAddName : []
        });
        setSelectedNursesID(rosterData.NursesIDAddName ? rosterData.NursesIDAddName : []);
        setSelectedBUNursesID(rosterData.BUNursesIDAddName ? rosterData.BUNursesIDAddName : []);
        setRosterDataID(rosterData.ID);
      }
    };
    action();
  },[Date, Shift, Area]);

  function disabledDate(current) {
    // Can not select days before today and today
    return current && current < moment(localStorage.getItem('fakelocaltime').split('JBTERRYLIN')[0]).add(-1, 'days').endOf('day');
  }

  const pageHeader = () => {
    return (
      <PageHeader
        title={
            <div>
                <DatePicker
                    format="YYYY-MM-DD"
                    size="small"
                    style={{ height: "24px" }}
                    defaultValue={moment(Date)}
                    allowClear={false}
                    disabledDate={disabledDate}
                    onChange={(value) => {
                      clearForm();
                      getRosterData(value.format("YYYY-MM-DD"), shift, area);
                      setDate(value.format("YYYY-MM-DD"));
                    }}
                />
                <Select 
                  defaultValue={Area ? areaList.find(value => parseInt(value.ID) === parseInt(Area)).AreaName : areaList[0].AreaName} 
                  style={{ width: 120, marginLeft: "16px" }} 
                  size="small"
                  onChange={(value) => {
                    clearForm();
                    getRosterData(date, shift, value);
                    setArea(value);
                  }}
                >
                  {
                    areaList.map((value, index) => 
                      <Option key={index} value={value.ID}>{value.AreaName}</Option>
                    )
                  }
                </Select>
                <Select 
                  defaultValue={Shift} 
                  style={{ width: 120, marginLeft: "16px" }} 
                  size="small" 
                  onChange={(value) => {
                    clearForm();
                    getRosterData(date, value, area);
                    setShift(value);
                  }}
                >
                  <Option value="Q1">Q1</Option>
                  <Option value="Q2">Q2</Option>
                  <Option value="Q3">Q3</Option>
                </Select>
                
                <Text> 's Roster</Text>
            </div>
        }
        style={{ border: "1px solid rgb(235, 237, 240)", borderLeft: "0px" }} 
      />
    );
  }

  const layout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
  };

  const tailLayout = {
      wrapperCol: { offset: 4, span: 16 },
  };

  const GroupNameOnChange = (values) => {
    const temp = groupList.filter((group) => group.ID === values)[0];
    formRef.current.setFieldsValue({
      NursesID: temp.IDAddName,
      LeaderID: temp.IDAddName.filter((element) => element.split(" ")[0]  === temp.LeaderID + "")[0],
      // for change group and that member is in nurse alr
      BUNursesID: 
        formRef.current.getFieldValue().BUNursesID &&
        formRef.current.getFieldValue().BUNursesID.filter((element) => !temp.IDAddName.includes(element)).length >= 1 ?
          formRef.current.getFieldValue().BUNursesID.filter((element) => !temp.IDAddName.includes(element))
        :
          []
    });
    
    setSelectedNursesID(temp.IDAddName);
    setSelectedBUNursesID(
      formRef.current.getFieldValue().BUNursesID &&
      [formRef.current.getFieldValue().BUNursesID].filter((element) => !temp.IDAddName.includes(element)).length >= 1 ?
        [formRef.current.getFieldValue().BUNursesID].filter((element) => !temp.IDAddName.includes(element))
      :
        []
    );
  }

  const NursesIDOnChange = (values) => {
    setSelectedNursesID(values);
    if( !formRef.current.getFieldValue().NursesID.includes( formRef.current.getFieldValue().LeaderID ) ) {
      formRef.current.setFieldsValue({
        LeaderID: null
      });
    }
  }

  const onFinish = async(values) => {
    var temp;
    if( formRef.current.getFieldValue().NursesID.includes( formRef.current.getFieldValue().LeaderID ) ) {
      temp = formRef.current.getFieldValue().NursesID.filter(function(e) { return e !== formRef.current.getFieldValue().LeaderID })
    }
    if(temp.length <= 3 || temp.length >= 6) {
      setErrorNursesID("Nurses input should between 4 and 5 (not inlcude leader)");
      return;
    }
    messagefunction("Loading");
    values.NursesID = temp;
    setErrorNursesID(null);
    values.DateTime = moment(date).format();
    values.Shift = shift;
    values.Area = area;
    values.LeaderID = values.LeaderID.split(" ")[0];
    values.NursesID = values.NursesID.map((value) => value.split(" ")[0]);
    if(values.BUNursesID) {
      values.BUNursesID = values.BUNursesID.map((value) => value.split(" ")[0]);
    }
    if(values.PTNursesID) {
      values.PTNursesID = values.PTNursesID.map((value) => value.split(" ")[0]);
    }
    values.CreateDateTime = moment().format();
    if(!values.saveGroupID) {
      values.GroupID = null;
    }
    if(rosterDataID !== 0) {
      await request("PUT", `Roster/${rosterDataID}`, values);
    } else {
      await request("POST", `Roster`,values);
    }
    router.push(`/rosterlist/${date}/${area}/${shift}`);
  }

  const form = () => {
    return (
      <Form
        {...layout}
        ref={formRef}
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        style = {{ marginTop: "32px" }}
      >
        <Form.Item 
          name="GroupID" 
          label="Group Name"
        >
          <Select 
            placeholder="Please select Group" 
            onChange={(values) => GroupNameOnChange(values)}
            showSearch={true}
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {
              groupList &&
              groupList.map((values, index) =>
                <Option key={index} value={values.ID}>{values.GroupName}</Option>
              )
            }
          </Select>
        </Form.Item>

        <Form.Item 
          name="NursesID" 
          label="NursesID" 
          rules={[{ required: true, message: 'Please input Nurses!' }]}
          validateStatus={errorNursesID ? "error" : null}
          help={errorNursesID ? errorNursesID : null}
        >
          <Select
            mode="multiple"
            placeholder="Please select Nurses" 
            onChange={(values) => NursesIDOnChange(values)}
          >
            {
              nurseList &&
              nurseList.map((values, index) =>
                <Option 
                  key={index} 
                  value={values.title} 
                  disabled={
                    selectedBUNursesID &&
                    selectedBUNursesID.includes(values.title) ?
                        true
                      :
                        false
                  }
                >
                  {`${values.title} ${selectedBUNursesID.includes(values.title) ? "choosed in BU Nurse" : ""}`}
                </Option>
              )
            }
          </Select>
        </Form.Item>

        <Form.Item 
          name="LeaderID" 
          label="Leader ID" 
          rules={[{ required: true, message: 'Please input Leader!' }]}
        >
          <Select 
            placeholder="Please select Leader"
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            {
              selectedNursesID &&
              selectedNursesID.map((values, index) =>
                <Option key={index} value={values}>{values}</Option>
              )
            }
          </Select>
        </Form.Item>

        <Form.Item 
          name="BUNursesID" 
          label="BUNursesID"
        >
          <Select
            mode="multiple"
            placeholder="Please select Nurses"
            onChange={(values) => setSelectedBUNursesID(values)}
          >
            {
              selectedNursesID ?
                nurseList.map((value) => value.title).filter(val => !selectedNursesID.includes(val)).map((values, index) =>
                  <Option key={index} value={values}>{values}</Option>
                )
              : 
                nurseList.map((values, index) =>
                  <Option key={index} value={values.title}>{values.title}</Option>
                )
            }
          </Select>
        </Form.Item>

        <Form.Item 
          name="PTNursesID" 
          label="PTNursesID" 
        >
          <Select
            mode="multiple"
            placeholder="Please select Nurses" 
          >
            {
              pTNursesList &&
              pTNursesList.map((values, index) =>
                <Option 
                  key={index} 
                  value={values.title} 
                >
                  {values.title}
                </Option>
              )
            }
          </Select>
        </Form.Item>

        <Form.Item 
          {...tailLayout}
          name="saveGroupID"
        >
          <Switch 
            checkedChildren="The roster and group member maybe will have different, do you want to save group name also?"  
            unCheckedChildren="The roster and group member maybe will have different, do you want to save group name also?"  
          />
        </Form.Item>

        <Form.Item {...tailLayout}>
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
        areaList && groupList && nurseList ?
          <div>
              {pageHeader()}
              {form()}
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

export default RosterAddPage; 