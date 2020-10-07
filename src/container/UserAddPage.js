import React, { useState, useEffect, useRef } from 'react';
import { 
  PageHeader,
  Form, 
  Input, 
  Button, 
  Select,
  Upload,
  DatePicker,
  Result
} from 'antd';
import { 
  PlusOutlined
} from '@ant-design/icons';
import MainStructure from '../component/MainStructure';
import request from '../utils/apisauce';
import messagefunction from '../utils/messagefunction';
import checkjob from '../utils/checkjob';
import{ useHistory, useParams } from 'react-router-dom';
import ImgCrop from 'antd-img-crop';
import moment from 'moment';

const { TextArea } = Input;
const { RangePicker } = DatePicker;

function UserAddPage() {
  const formRef = useRef();
  const { ID } = useParams();
  const router = useHistory();
  const pageName = router.location.pathname.indexOf("/useredit") !== -1 ? "useredit" : "useradd";

  const [imageUrl, setImageUrl] = useState(null);
  const [isResign, setIsResign] = useState(false);
  const [responseStatus, setResponseStatus] = useState(true);

  useEffect(() => {
    const action = async function() {
      if (pageName === "useredit"){
        var response = await request("GET", `User/${ID}`);
        if(response.Ok) {
          response = response.Result.result;
          setImageUrl(response.Picture);
          setIsResign(response.IsResign);
  
          formRef.current.setFieldsValue({
            Job: response.Job,
            Name: response.Name,
            PhoneNumber: response.PhoneNumber,
            RegisterDateTime: moment(response.RegisterDateTime),
          });
  
          if(response.IsResign) {
            formRef.current.setFieldsValue({
              DateTime: [moment(response.RegisterDateTime), moment(response.ResignDateTime)],
              ResignReason: response.ResignReason,
            });
          }
        } else {
          setResponseStatus(false);
        }
      }
    };
    action();
  },[ID, pageName]);

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };

  const tailLayout = {
    wrapperCol: { offset: 4, span: 16 },
  };
  
  const pageHeader = () => {
    return (
      <PageHeader
        title={pageName === "useradd" ? "Add User" : "Edit User"}
        style={{ border: "1px solid rgb(235, 237, 240)", borderLeft: "0px" }} 
      />
    );
  }
  
  const onFinish = async (values) => {
    messagefunction("Loading");
    const temp = {
      "Name": values.Name,
      "Password": values.Password,
      "PhoneNumber": values.PhoneNumber,
      "Job": values.Job,
      "Picture": imageUrl,
      "RegisterDateTime": moment(localStorage.getItem('fakelocaltime').split('JBTERRYLIN')[0]).format(),
    }

    if (pageName === "useredit") {
      temp.RegisterDateTime = values.RegisterDateTime ? values.RegisterDateTime.format() : values.DateTime[0].format();
      temp.ResignReason = values.ResignReason;
      temp.IsResign = isResign
    }
    if(isResign) {
      temp.ResignDateTime = values.DateTime[1].format();
    }
    var response = null;
    if(pageName === "useradd") {
      response = await request("POST", `User`, temp);
    } else if(pageName === "useredit") {
      response = await request("PUT", `User/${ID}`, temp);
    }
    router.push(`/userdetail/${response.Result.result.ID}`);
  };

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  }
  
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      //message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      //message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  }

  const handleChange = info => {
    if (info.file.status === "uploading") {
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl =>
        setImageUrl(imageUrl)
      );
    }
  };

  const checkPhoneNumber = (rule, value) => {
    if (value && !isNaN(value)) {
      return Promise.resolve();
    }
    return Promise.reject('Phone number should be only number');
  };
  
  const form = () => {
    return (
      <Form
        {...layout}
        name="basic"
        ref={formRef}
        onFinish={onFinish}
        style = {{ marginTop: "32px" }}
      >
        <Form.Item 
          label="Job"
          name="Job"
          rules={[{ required: true, message: 'Please input Job!' }]}
        >
          <Select>
            {/* <Select.Option value="Admin">Admin</Select.Option> */}
            {
              checkjob(["Admin"]) ?
                <Select.Option value="Manager">Manager</Select.Option>
              :
                <Select.Option value="Nurse">Nurse</Select.Option>
            }
            {
              checkjob(["Manager"]) ?
                <Select.Option value="PTNurse">PTNurse</Select.Option>
              :
                null
            }
          </Select>
        </Form.Item>

        <Form.Item
          label="Name"
          name="Name"
          rules={[{ required: true, message: 'Please input Name!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="Password"
          rules={[{ required: true, message: 'Please input Password!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="PhoneNumber"
          label="PhoneNumber"
          rules={[{ validator: checkPhoneNumber }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="Picture"
          label="Picture"
          valuePropName="Picture"
        >
          <ImgCrop rotate>
            <Upload
              name="avatar"
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              beforeUpload={beforeUpload}
              onChange={handleChange}
            >
              {
                imageUrl ? 
                  <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
                : 
                  <div>
                    <PlusOutlined />
                    <div className="ant-upload-text">Upload</div>
                  </div>
              }
            </Upload>
          </ImgCrop>
        </Form.Item>

        {
          pageName === "useredit" && !isResign ?
            <Form.Item
              label="RegisterDateTime"
              name="RegisterDateTime"
              rules={[{ required: true, message: 'Please input Register Date Time!' }]}
            >
              <DatePicker
                showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
              />
            </Form.Item>
          :
            null
        }

        {
          isResign ?
            <Form.Item
              label="DateTime"
              name="DateTime"
              rules={[{ required: true, message: 'Please input Work duration!' }]}
            >
              <RangePicker showTime />
            </Form.Item>
          :
            null
        }

        {
          isResign ?
            <Form.Item
              label="ResignReason"
              name="ResignReason"
            >
              <TextArea rows={4} />
            </Form.Item>
          :
            null
        }

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
        <div>
          {pageHeader()}
          {
            pageName === "useradd" || (pageName === "useredit" && responseStatus) ?
              form()
            :
              <Result
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
              />
          }
        </div>
      }
    />
  );
}

export default UserAddPage; 
